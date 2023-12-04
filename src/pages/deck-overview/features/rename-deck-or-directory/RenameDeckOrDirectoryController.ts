import {DeckOrDirectory} from "../../../../types/DeckOrDirectory";
import DeckOverviewController from "../../DeckOverviewController";
import {StaticText} from "../../../../data/text/staticText";
import store from "../../../../stores/store";
import {decksSlice, directoriesSlice} from "../../../../stores/slices";
import State from "../../../../types/State";
import {SnackbarFunction} from "../../../../types/snackbar";
import DeckUtils from "../../../../utils/DeckUtils";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import DirectoryUtils from "../../../../utils/DirectoryUtils";

interface RenameDeckOrDirectoryControllerOptions extends ModalControllerOptions {
    deckOverviewController: DeckOverviewController
    snackbar: SnackbarFunction
}

export default class RenameDeckOrDirectoryController extends ModalController<RenameDeckOrDirectoryControllerOptions> {

    public deckOverviewController: DeckOverviewController

    constructor(options: RenameDeckOrDirectoryControllerOptions) {
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
        const selectedDeckOrDirectory = this.deckOverviewController.getSelectedTempDeckOrDirectory()
        const deckOrDirectoryName = this.deckOverviewController.getTextFieldValue("deckOrDirectoryName")
        if (deckOrDirectoryName.replaceAll(" ", "") === "") {
            return this.snackbar(StaticText.FIELD_EMPTY, 4000, "error")
        }
        const maxNameLength = DeckUtils.getInstance().storeSchema.name.limit
        if (deckOrDirectoryName.length > maxNameLength) {
            return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", maxNameLength.toString()), 4000, "error")
        }

        if (selectedDeckOrDirectory.isDirectory) {
            const directory = {
                ...selectedDeckOrDirectory,
                name: deckOrDirectoryName
            }
            DirectoryUtils.getInstance().update(directory)
            this.snackbar(StaticText.RENAMED_DIRECTORY, 4000)
        } else {
            const deck = {
                ...selectedDeckOrDirectory,
                name: deckOrDirectoryName
            }
            DeckUtils.getInstance().update(deck)
            this.snackbar(StaticText.RENAMED_DECK, 4000)
        }


        this.close()
    }

}