import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardTypesController from "../../CardTypesController";
import State from "../../../../types/State";
import CardType from "../../../../types/dbmodel/CardType";
import FieldUtils from "../../../../utils/FieldUtils";
import {generateModelId, getTextFieldValue, numberArray} from "../../../../utils/general";
import {StaticText} from "../../../../data/text/staticText";
import Field from "../../../../types/dbmodel/Field";
import CardUtils from "../../../../utils/CardUtils";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import CardTypeUtils from "../../../../utils/CardTypeUtils";

interface EditCardTypeControllerOptions extends ModalControllerOptions {
    cardTypesController: CardTypesController
    states: {
        showState: State<boolean>
        numOfFieldsState: State<number>
    }
}


export default class EditCardTypeController extends ModalController<EditCardTypeControllerOptions> {

    public cardTypesController: CardTypesController;

    constructor(options: EditCardTypeControllerOptions) {
        super(options);
        this.cardTypesController = options.cardTypesController;

    }

    public open = (cardType?: CardType) => {
        this.cardTypesController.selectTempCardType(cardType!)
        this.states.showState.set(true)
        const fields = FieldUtils.getInstance().getAllBy("cardTypeId", cardType!.id)
        this.states.numOfFieldsState.set(fields.length)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        const numOfFields = this.states.numOfFieldsState.val

        const cardType = this.cardTypesController.getTempSelectedCardType()


        const cardTypeName = getTextFieldValue("card-type-name") as string

        if (cardTypeName.length === 0 || cardTypeName.replaceAll(" ", "").length === 0) {
            return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
        }

        if (cardTypeName.length > CardTypeUtils.getInstance().storeSchema.name.limit) {
            return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", CardTypeUtils.getInstance().storeSchema.name.limit.toString()), 5000, "error")
        }

        if (cardTypeName !== cardType.name) {
            CardTypeUtils.getInstance().update({
                ...cardType,
                name: cardTypeName
            })
        }


        const fields = FieldUtils.getInstance().getAllBy("cardTypeId", cardType.id)

        const fieldsToAdd: Field[] = []
        const fieldsToUpdate: Field[] = []
        const fieldsIdsToDelete: string[] = []


        for (let i = 0; i < fields.length; i++) {
            const field = fields[i]
            const updatedFieldName = getTextFieldValue(`field-name-${i}`)

            if (!updatedFieldName) {
                fieldsIdsToDelete.push(field.id)
                continue
            }

            if (updatedFieldName.length === 0 || updatedFieldName.replaceAll(" ", "").length === 0) {
                return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
            }

            if (updatedFieldName.length > FieldUtils.getInstance().storeSchema.name.limit) {
                return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", FieldUtils.getInstance().storeSchema.name.limit.toString()), 5000, "error")
            }

            if (updatedFieldName !== field.name) {
                fieldsToUpdate.push({
                    ...field,
                    name: updatedFieldName
                })
            }
        }


        if (numOfFields > fields.length) {

            for (const num of numberArray(fields.length, numOfFields - 1)) {

                const fieldName = getTextFieldValue(`field-name-${num}`)!
                if (fieldName.length === 0 || fieldName.replaceAll(" ", "").length === 0) {
                    return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
                }

                fieldsToAdd.push({
                    id: generateModelId(),
                    name: fieldName,
                    cardTypeId: cardType.id,
                })
            }
        }


        if (fieldsIdsToDelete.length > 0) {
            FieldUtils.getInstance().delete(fieldsIdsToDelete)
        }

        if (fieldsToUpdate.length > 0) {
            FieldUtils.getInstance().update(fieldsToUpdate)
        }

        if (fieldsToAdd.length > 0) {
            FieldUtils.getInstance().add(fieldsToAdd)
            const fieldContentsToAdd = []

            const cards = CardUtils.getInstance().getAllBy("cardTypeId", cardType.id)
            for (const card of cards) {
                for (const field of fieldsToAdd) {
                    fieldContentsToAdd.push({
                        id: generateModelId(),
                        cardId: card.id,
                        deckId: card.deckId,
                        fieldId: field.id,
                        content: ""
                    })
                }
            }
            FieldContentUtils.getInstance().add(fieldContentsToAdd)
        }

        this.snackbar(StaticText.CHANGES_SAVED, 3000)
        this.close()
    }

}