import {SnackbarFunction} from "../../types/snackbar";
import Card from "../../types/dbmodel/Card";
import State from "../../types/State";
import ViewEntitySelectionController from "../../controller/ViewEntitySelectionController";
import Deck from "../../types/dbmodel/Deck";
import DeckUtils from "../../utils/DeckUtils";
import CardUtils from "../../utils/CardUtils";
import {DeckOrDirectory} from "../../types/DeckOrDirectory";
import FieldContentUtils from "../../utils/FieldContentUtils";

interface CardsControllerOptions {

    deckId?: string
    snackbar: SnackbarFunction
    topLevelInitDone: boolean

    states: {
        initDoneState: State<boolean>
        selectedEntitiesState: State<Card[]>
        selectedEntitiesAnchorElState: State<Card | null>
        deckState: State<Deck | null>
        tempSelectedCardState: State<Card | null>
        currentPageState: State<number>
        maxItemsPerPageState: State<number>
    }


}


export default class CardsController extends ViewEntitySelectionController<Card> {

    public static MAX_ITEMS_PER_PAGE = 10


    public deckId?: string

    private snackbar: SnackbarFunction

    public topLevelInitDone: boolean

    public states: CardsControllerOptions["states"]


    constructor(options: CardsControllerOptions) {
        const viewItemsGetter = () => options.deckId ?
            this.toCardViewItems(CardUtils.getInstance().getCardsByDirectoryId(options.deckId)) : []
        super({
            ...options,
            viewItemsGetter,
        })
        this.deckId = options.deckId
        this.snackbar = options.snackbar
        this.topLevelInitDone = options.topLevelInitDone
        this.states = options.states
    }

    public toCardViewItems = (cards: Card[], filterByDeck = false): Card[] => {
        if (!this.topLevelInitDone) return []

        const page = this.states.currentPageState.val
        const cardsPerPage = this.states.maxItemsPerPageState.val


        if (filterByDeck) {
            return cards
                .filter(card => card.deckId === this.deckId).sort((a, b) => a.paused - b.paused)
                .slice(page * cardsPerPage - cardsPerPage, page * cardsPerPage)
        } else {
            return cards.sort((a, b) => a.paused - b.paused)
        }
    }

    public entitiesSelected = () => {
        return this.states.selectedEntitiesState.val.length > 0
    }

    public selectedEntitiesSameCardType = () => {
        const selectedEntities = this.states.selectedEntitiesState.val
        if (selectedEntities.length === 0) return false
        const cardTypeId = selectedEntities[0].cardTypeId
        return selectedEntities.every(card => card.cardTypeId === cardTypeId)
    }

    public selectTempCard(card: Card | null) {
        if (card === null) throw new Error("Invalid entity: the entity is not a card")
        if (card.id === this.states.tempSelectedCardState.val?.id) return
        this.states.tempSelectedCardState.set(card)
    }

    /**
     *  Function to get the selected deck or directory. Throws an error if no deck or directory is selected
     **/

    public getSelectedCard(): Card | never {
        if (this.states.tempSelectedCardState.val === null) throw new Error("No card selected")
        return this.states.tempSelectedCardState.val
    }

    public getTextFieldValue(id: string): string {
        const element = document.getElementById(id) as HTMLInputElement
        return element.value
    }

    public getOnKeyboardShortcut = (shortcuts: { [char: string]: () => void }, isModalOpen: boolean) => {
        return (event: KeyboardEvent) => {
            if (isModalOpen) return
            const ctrl = event.ctrlKey || event.metaKey

            if (ctrl) {
                const char = event.key
                if (shortcuts[char]) {
                    shortcuts[char]()
                }
            }
        }
    }

}