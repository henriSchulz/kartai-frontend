import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardsController from "../../CardsController";
import Card from "../../../../types/dbmodel/Card";
import DeckUtils from "../../../../utils/DeckUtils";
import DirectoryUtils from "../../../../utils/DirectoryUtils";

interface CardInformationControllerOptions extends ModalControllerOptions {
    cardsController: CardsController
}


export default class CardInformationController extends ModalController<CardInformationControllerOptions> {
    public cardsController: CardsController

    constructor(options: CardInformationControllerOptions) {
        super(options)
        this.cardsController = options.cardsController
    }

    public getPathString(): string {

        const tempSelectedCard = this.cardsController.states.tempSelectedCardState.val

        if (tempSelectedCard) {
            const deck = DeckUtils.getInstance().getById(tempSelectedCard.deckId)
            return DirectoryUtils.getInstance().getPathString(deck.parentId, true)
        }

        return ""
    }

    public open = (card?: Card) => {
        this.cardsController.selectTempCard(card!)
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        this.close()
    }
}