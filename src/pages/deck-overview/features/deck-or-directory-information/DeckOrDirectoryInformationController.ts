import DeckOverviewController from "../../DeckOverviewController";
import State from "../../../../types/State";
import {SnackbarFunction} from "../../../../types/snackbar";
import {DeckOrDirectory} from "../../../../types/DeckOrDirectory";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardUtils from "../../../../utils/CardUtils";
import DeckUtils from "../../../../utils/DeckUtils";
import Card from "../../../../types/dbmodel/Card";


interface DeckOrDirectoryInformationControllerOptions extends ModalControllerOptions {
    deckOverviewController: DeckOverviewController,
    snackbar: SnackbarFunction
}


export default class DeckOrDirectoryInformationController extends ModalController<DeckOrDirectoryInformationControllerOptions> {

    public readonly deckOverviewController: DeckOverviewController

    constructor(options: DeckOrDirectoryInformationControllerOptions) {
        super(options)
        this.deckOverviewController = options.deckOverviewController
    }

    open = (deckOrDirectory?: DeckOrDirectory) => {
        this.deckOverviewController.selectTempDeckOrDirectory(deckOrDirectory!)
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }


    submit = () => {
        this.close()
    }


    getCardsCount = (): number => {
        const tempDeckOrDirectory = this.deckOverviewController.states.tempDeckOrDirectoryState.val

        if (!tempDeckOrDirectory?.isDirectory) {
            return CardUtils.getInstance().getCardsByDeckId(
                tempDeckOrDirectory?.id ?? "").length

        } else {
            return CardUtils.getInstance().getCardsByDirectoryId(tempDeckOrDirectory?.id ?? "").length
        }
    }

    getAverageLearningState = (): number | null => {
        const tempDeckOrDirectory = this.deckOverviewController.states.tempDeckOrDirectoryState.val

        let cards: null | Card[] = null

        if (!tempDeckOrDirectory?.isDirectory) {
            cards = CardUtils.getInstance().getCardsByDeckId(tempDeckOrDirectory?.id ?? "")
        } else {
            cards = CardUtils.getInstance().getCardsByDirectoryId(tempDeckOrDirectory?.id ?? "")
        }

        if (!cards || cards.length === 0) return 0

        let average = cards.reduce((acc, card) => acc + card.learningState, 0) / cards.length

        return Math.round(average * 100) / 100
    }


}