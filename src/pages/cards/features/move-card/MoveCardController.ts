import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardsController from "../../CardsController";
import State from "../../../../types/State";
import Card from "../../../../types/dbmodel/Card";
import {StaticText} from "../../../../data/text/staticText";
import CardUtils from "../../../../utils/CardUtils";
import DeckUtils from "../../../../utils/DeckUtils";
import {LocalStorageKeys} from "../../../../data/LocalStorageKeys";

interface MoveCardControllerOptions extends ModalControllerOptions {
    cardsController: CardsController,
    states: {
        showState: State<boolean>
        selectedDestinationDeckIdState: State<string>
    }
}


export default class MoveCardController extends ModalController<MoveCardControllerOptions> {
    public cardsController: CardsController

    constructor(options: MoveCardControllerOptions) {
        super(options)
        this.cardsController = options.cardsController
    }


    public getTexts = (): { title: string } => {
        if (this.cardsController.entitiesSelected()) {
            return {
                title: StaticText.MOVE_CARDS.replaceAll("{items}", this.cardsController.states.selectedEntitiesState.val.length.toString())
            }
        } else {
            return {
                title: StaticText.MOVE_CARD
            }
        }
    }

    public setDefaultDeckId = (card: Card) => {
        const lastSelectedDeckId = localStorage.getItem(LocalStorageKeys.LAST_SELECTED_DECK)
        try {
            const lastSelectedDeck = DeckUtils.getInstance().getById(lastSelectedDeckId!)
            if (lastSelectedDeck.id !== card.deckId) {
                this.states.selectedDestinationDeckIdState.set(lastSelectedDeck.id)
            } else {
                const deck = DeckUtils.getInstance().toArray().find(deck => deck.id !== card.deckId)
                if (deck) {
                    this.states.selectedDestinationDeckIdState.set(deck.id)
                }
            }
        } catch (e) {
            const deck = DeckUtils.getInstance().toArray().find(deck => deck.id !== card.deckId)
            if (deck) {
                this.states.selectedDestinationDeckIdState.set(deck.id)
            }
        }
    }

    public open = (card?: Card) => {
        this.setDefaultDeckId(card!)
        this.cardsController.selectTempCard(card!)
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        this.cardsController.states.selectedEntitiesState.set([])
        if (this.cardsController.entitiesSelected()) {
            const destinationDeck = DeckUtils.getInstance().getById(this.states.selectedDestinationDeckIdState.val)

            const cardsToUpdate = this.cardsController.states.selectedEntitiesState.val.map(card => ({
                ...card,
                deckId: destinationDeck.id
            }))
            CardUtils.getInstance().update(cardsToUpdate)

            this.snackbar(
                StaticText.CARDS_MOVED
                    .replaceAll("{cards}", cardsToUpdate.length.toString())
                    .replaceAll("{deck}", destinationDeck.name)
                , 4000)
        } else {
            const card = this.cardsController.getSelectedCard()
            const destinationDeck = DeckUtils.getInstance().getById(this.states.selectedDestinationDeckIdState.val)
            CardUtils.getInstance().update({
                ...card,
                deckId: destinationDeck.id
            })
            this.snackbar(
                StaticText.CARD_MOVED
                    .replaceAll("{deck}", destinationDeck.name)
                , 4000)
        }


        this.close()
    }
}


