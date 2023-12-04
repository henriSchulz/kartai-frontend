import DeckOverviewController from "../../DeckOverviewController";
import State from "../../../../types/State";
import {SnackbarFunction} from "../../../../types/snackbar";
import {DeckOrDirectory} from "../../../../types/DeckOrDirectory";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";


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


}