import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardTypesController from "../../CardTypesController";
import State from "../../../../types/State";
import {generateModelId, getTextFieldValue, numberArray} from "../../../../utils/general";
import {StaticText} from "../../../../data/text/staticText";
import FieldUtils from "../../../../utils/FieldUtils";
import Field from "../../../../types/dbmodel/Field";
import CardType from "../../../../types/dbmodel/CardType";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import CardTypeVariant from "../../../../types/dbmodel/CardTypeVariant";
import CardTypeVariantUtils from "../../../../utils/CardTypeVariantUtils";

interface NewCardTypeControllerOptions extends ModalControllerOptions {
    cardTypesController: CardTypesController
    states: {
        showState: State<boolean>
        numOfFieldsState: State<number>
    }
}


export default class NewCardTypeController extends ModalController<NewCardTypeControllerOptions> {

    public cardTypesController: CardTypesController;

    constructor(options: NewCardTypeControllerOptions) {
        super(options);
        this.cardTypesController = options.cardTypesController;

    }

    public open = () => {
        this.states.showState.set(true)
        this.states.numOfFieldsState.set(2)
    }

    public close = () => {
        this.states.showState.set(false)
    }
    public submit = () => {
        const numOfFields = this.states.numOfFieldsState.val


        const cardTypeName = getTextFieldValue("card-type-name")

        if (cardTypeName === "" || !cardTypeName || cardTypeName.replaceAll(" ", "").length === 0) {
            return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
        }

        const limit = CardTypeUtils.getInstance().storeSchema.name.limit

        if (cardTypeName.length > limit) {
            return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", limit.toString()), 5000, "error")
        }


        const cardType: CardType = {
            id: generateModelId(),
            name: cardTypeName
        }


        const fieldsToAdd: Field[] = []

        for (const num of numberArray(0, numOfFields - 1)) {
            const fieldName = getTextFieldValue(`field-name-${num}`)

            if (fieldName === "" || !fieldName || fieldName.replaceAll(" ", "").length === 0) {
                return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
            }

            const limit = FieldUtils.getInstance().storeSchema.name.limit
            if (fieldName.length > limit) {
                return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", limit.toString()), 5000, "error")
            }
            fieldsToAdd.push({
                id: generateModelId(),
                name: fieldName,
                cardTypeId: cardType.id
            })
        }

        const {templateFront, templateBack} = CardTypeVariantUtils.generateDefaultTemplates(fieldsToAdd)

        const cardTypeVariant: CardTypeVariant = {
            id: generateModelId(),
            name: StaticText.CARD + " 1",
            cardTypeId: cardType.id,
            templateFront, templateBack
        }


        CardTypeUtils.getInstance().addCardTypesAndVariantsAndFields([cardType], [cardTypeVariant], fieldsToAdd)

        this.snackbar(StaticText.CARD_TYPE_CREATED, 3000)

        this.close()
    }

}