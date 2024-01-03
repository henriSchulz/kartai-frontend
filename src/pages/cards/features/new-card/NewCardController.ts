import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardsController from "../../CardsController";
import State from "../../../../types/State";
import {LocalStorageKeys} from "../../../../data/LocalStorageKeys";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import FieldUtils from "../../../../utils/FieldUtils";
import {StaticText} from "../../../../data/text/staticText";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import Card from "../../../../types/dbmodel/Card";
import {generateModelId} from "../../../../utils/general";
import FieldContent from "../../../../types/dbmodel/FieldContent";
import CardUtils from "../../../../utils/CardUtils";
import {Limits} from "../../../../Settings";

interface NewCardControllerOptions extends ModalControllerOptions {
    cardsController: CardsController
    states: {
        showState: State<boolean>
        selectedCardTypeIdState: State<string>
    }
}


export default class NewCardController extends ModalController<NewCardControllerOptions> {
    public cardsController: CardsController

    constructor(options: NewCardControllerOptions) {
        super(options)
        this.cardsController = options.cardsController
    }

    public setDefaultSelectedCardType = (): string | null => {
        let cardTypeId = localStorage.getItem(LocalStorageKeys.LAST_SELECTED_CARD_TYPE)
        if (cardTypeId && CardTypeUtils.getInstance().has(cardTypeId)) {
            this.states.selectedCardTypeIdState.set(cardTypeId)
            return cardTypeId
        } else {
            const cardType = CardTypeUtils.getInstance().toArray()[0]
            if (cardType) {
                this.states.selectedCardTypeIdState.set(cardType.id)
                return cardType.id
            }
        }
        return null
    }

    public open = () => {
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        const fields = FieldUtils.getInstance().getAllBy("cardTypeId", this.states.selectedCardTypeIdState.val)

        const maxTextLength = FieldContentUtils.getInstance().storeSchema.content.limit


        if (!this.cardsController.deckId) throw new Error("Deck id is not set")

        const card: Card = {
            id: generateModelId(),
            learningState: 0,
            paused: 0,
            dueAt: Date.now(),
            cardTypeId: this.states.selectedCardTypeIdState.val,
            deckId: this.cardsController.deckId!
        }


        const maxCardCount = CardUtils.getInstance().maxClientSize

        if (!CardUtils.getInstance().canAdd(1)) {
            return this.snackbar(StaticText.STORAGE_LIMIT.replaceAll("{items}", maxCardCount.toString()), 4000, "error")
        }

        const deckCardsCount = CardUtils.getInstance().getCardsByDeckId(this.cardsController.deckId).length

        if (deckCardsCount + 1 > Limits.DECK_SIZE_LIMIT) {
            return this.snackbar(StaticText.STORAGE_LIMIT_DECK.replaceAll("{items}", Limits.DECK_SIZE_LIMIT.toString()), 4000, "error")
        }

        const fieldContentsToAdd: FieldContent[] = []

        for (const field of fields) {
            const textFieldValue = this.cardsController.getTextFieldValue(field.id)

            if (!textFieldValue || textFieldValue.replaceAll(" ", "").length === 0) {
                return this.snackbar(StaticText.FIELD_EMPTY, 4000, "error")
            }

            if (textFieldValue.length > maxTextLength) {
                return this.snackbar(StaticText.FIELD_CONTENT_TOO_LONG
                        .replaceAll("{limit}", maxTextLength.toString())
                        .replaceAll("{field}", field.name)
                    , 4000, "error")
            }
            const filedContent: FieldContent = {
                id: generateModelId(),
                fieldId: field.id,
                cardId: card.id,
                content: textFieldValue
            }

            fieldContentsToAdd.push(filedContent)
        }

        CardUtils.getInstance().addCardsAndFieldContents([card], fieldContentsToAdd)
        localStorage.setItem(LocalStorageKeys.LAST_SELECTED_CARD_TYPE, this.states.selectedCardTypeIdState.val)
        this.close()
        this.snackbar(StaticText.CARD_ADDED, 4000)

    }

}