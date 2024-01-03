import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardsController from "../../CardsController";
import State from "../../../../types/State";
import {LocalStorageKeys} from "../../../../data/LocalStorageKeys";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import Card from "../../../../types/dbmodel/Card";
import FieldUtils from "../../../../utils/FieldUtils";
import {StaticText} from "../../../../data/text/staticText";
import Field from "../../../../types/dbmodel/Field";
import FieldContent from "../../../../types/dbmodel/FieldContent";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import {generateModelId} from "../../../../utils/general";
import CardUtils from "../../../../utils/CardUtils";

interface ChangeCardTypeControllerOptions extends ModalControllerOptions {
    cardsController: CardsController
    states: {
        showState: State<boolean>
        selectedCardTypeIdState: State<string>
        fieldsChoiceState: State<Record<string, string>>
    }
}

export default class ChangeCardTypeController extends ModalController<ChangeCardTypeControllerOptions> {
    public cardsController: CardsController

    constructor(options: ChangeCardTypeControllerOptions) {
        super(options);
        this.cardsController = options.cardsController;
    }


    setDefaultSelectedCardTypeId = (card: Card) => {
        const lastSelectedCardTypeId = localStorage.getItem(LocalStorageKeys.LAST_SELECTED_CARD_TYPE);
        try {
            const cardType = CardTypeUtils.getInstance().getById(lastSelectedCardTypeId!);
            if (cardType.id !== card.cardTypeId) {
                this.states.selectedCardTypeIdState.set(card.cardTypeId);
            } else {
                const cardType = CardTypeUtils.getInstance().toArray().find(cardType => cardType.id !== card.cardTypeId);
                if (cardType) {
                    this.states.selectedCardTypeIdState.set(cardType.id);
                }
            }
        } catch (e) {
            const cardType = CardTypeUtils.getInstance().toArray().find(cardType => cardType.id !== card.cardTypeId);
            if (cardType) {
                this.states.selectedCardTypeIdState.set(cardType.id);
            }
        }
    }

    public open = (card?: Card) => {
        this.setDefaultSelectedCardTypeId(card!)
        this.cardsController.selectTempCard(card!);
        this.states.showState.set(true);
    }

    public close = () => {
        this.states.showState.set(false);
    }

    private hasDuplicateValues(inputObject: object) {
        const seenValues = new Set();

        const values = Object.values(inputObject);

        for (const value of values) {
            if (value !== 'EMPTY') {
                if (seenValues.has(value)) {
                    return true; // Das Objekt enthält einen doppelten Wert.
                } else {
                    seenValues.add(value);
                }
            }
        }

        return false; // Das Objekt enthält keine doppelten Werte.
    }

    private changeCardType = (card: Card) => {
        const fieldChoices = this.states.fieldsChoiceState.val

        const fieldContents = FieldContentUtils.getInstance().getAllBy("cardId", card.id)
        const fieldContentIdsToDelete: string[] = []
        const fieldContentsToUpdate: FieldContent[] = []
        const selectedFields = FieldUtils.getInstance().getAllBy("cardTypeId", this.states.selectedCardTypeIdState.val)
        const fieldContentsToAdd: FieldContent[] = []

        const changedFields = []


        for (const fieldContent of fieldContents) {
            const newFieldId = fieldChoices[fieldContent.fieldId]

            if (newFieldId === "EMPTY") {
                fieldContentIdsToDelete.push(fieldContent.id)
                continue
            }

            changedFields.push(newFieldId)

            fieldContentsToUpdate.push({
                ...fieldContent,
                fieldId: newFieldId,
            })
        }

        const cardToAdd = {
            ...card,
            lastModifiedAt: Date.now(),
            cardTypeId: this.states.selectedCardTypeIdState.val
        }

        if (selectedFields!.length > changedFields.length) {
            for (const selectedField of selectedFields!) {
                if (!changedFields.includes(selectedField.id)) {
                    const fieldContent: FieldContent = {
                        id: generateModelId(),
                        fieldId: selectedField.id,
                        cardId: card.id,
                        content: ""
                    }
                    fieldContentsToAdd.push(fieldContent)
                }
            }
        }

        return {
            cardToAdd,
            fieldContentsToAdd,
            fieldContentsToUpdate,
            fieldContentIdsToDelete
        }

    }


    public submit = () => {
        const originCardTypeId = this.cardsController.getSelectedCard().cardTypeId

        const originFields = FieldUtils.getInstance().getAllBy("cardTypeId", originCardTypeId)

        const fieldChoices = this.states.fieldsChoiceState.val

        const entries = Object.entries(fieldChoices)


        if (entries.length !== originFields.length) {
            return this.snackbar(StaticText.ALL_FIELDS_MUST_BE_ASSIGNED, 6000, "error")
        }

        if (this.hasDuplicateValues(fieldChoices)) {
            return this.snackbar(StaticText.EACH_FIELD_CAN_ONLY_BE_ASSIGNED_TO_ONE_OTHER_FIELD, 6000, "error")
        }

        const emptyCount = Object.values(fieldChoices).filter(e => e === "EMPTY").length

        const selectedFields = FieldUtils.getInstance().getAllBy("cardTypeId", this.states.selectedCardTypeIdState.val)

        const allowedEmptyCount = originFields.length - selectedFields!.length

        if (emptyCount !== 0 && emptyCount > allowedEmptyCount) {
            return this.snackbar(StaticText.ALLOW_MINIMUM_EMPTY_FIELDS, 6000, "error")
        }

        const fieldContentIdsToDelete: string[] = []
        const fieldContentsToAdd: FieldContent[] = []
        const cardsToUpdate: Card[] = []
        const fieldContentsToUpdate: FieldContent[] = []


        const cards = this.cardsController.entitiesSelected() ? this.cardsController.states.selectedEntitiesState.val : [this.cardsController.getSelectedCard()]

        for (const card of cards) {
            const {
                cardToAdd,
                fieldContentsToAdd: fcta,
                fieldContentsToUpdate: fctu,
                fieldContentIdsToDelete: fctd
            } = this.changeCardType(card)
            cardsToUpdate.push(cardToAdd)
            fieldContentsToAdd.push(...fcta)
            fieldContentsToUpdate.push(...fctu)
            fieldContentIdsToDelete.push(...fctd)


            if (fieldContentIdsToDelete.length !== 0) {
                FieldContentUtils.getInstance().delete(fieldContentIdsToDelete)
            }

            if (fieldContentsToAdd.length !== 0) {
                FieldContentUtils.getInstance().add(fieldContentsToAdd)
            }

            FieldContentUtils.getInstance().update(fieldContentsToUpdate)
            CardUtils.getInstance().update(cardsToUpdate)
            this.snackbar(StaticText.CARD_TYPE_CHANGED, 2000)
            this.close()
        }

        this.close();


    }

}