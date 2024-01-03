import DeckOverviewController from "../../DeckOverviewController";
import State from "../../../../types/State";
import {SnackbarFunction} from "../../../../types/snackbar";
import {DeckOrDirectory} from "../../../../types/DeckOrDirectory";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardUtils from "../../../../utils/CardUtils";
import DeckUtils from "../../../../utils/DeckUtils";


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


    getCardsCountText = (): string => {
        const tempDeckOrDirectory = this.deckOverviewController.states.tempDeckOrDirectoryState.val

        if (!tempDeckOrDirectory?.isDirectory) {
            return `${CardUtils.getInstance().getCardsByDeckId(
                tempDeckOrDirectory?.id ?? "").length
            }`
        } else {
            return CardUtils.getInstance().getCardsByDirectoryId(tempDeckOrDirectory?.id ?? "").length.toString()
        }
    }


}