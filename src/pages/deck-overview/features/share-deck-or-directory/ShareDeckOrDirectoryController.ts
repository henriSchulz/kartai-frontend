import State from "../../../../types/State";
import {SnackbarFunction} from "../../../../types/snackbar";
import DeckOverviewController from "../../DeckOverviewController";
import {DeckOrDirectory} from "../../../../types/DeckOrDirectory";
import store from "../../../../stores/store";
import {decksSlice, directoriesSlice} from "../../../../stores/slices";
import ApiService from "../../../../services/ApiService";
import AuthenticationService from "../../../../services/AuthenticationService";
import {generateModelId} from "../../../../utils/general";
import SharedItem from "../../../../types/dbmodel/SharedItem";
import {StaticText} from "../../../../data/text/staticText";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import DirectoryUtils from "../../../../utils/DirectoryUtils";
import DeckUtils from "../../../../utils/DeckUtils";

interface ShareDeckOrDirectoryControllerOptions extends ModalControllerOptions {
    snackbar: SnackbarFunction,
    deckOverviewController: DeckOverviewController
}


export default class ShareDeckOrDirectoryController extends ModalController<ShareDeckOrDirectoryControllerOptions> {


    public readonly deckOverviewController: ShareDeckOrDirectoryControllerOptions["deckOverviewController"]

    constructor(options: ShareDeckOrDirectoryControllerOptions) {
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
        const deckOrDirectory = this.deckOverviewController.getSelectedTempDeckOrDirectory()

        const sharedItem: SharedItem = {
            id: generateModelId(),
            sharedItemId: deckOrDirectory.id,
            clientId: AuthenticationService.current!.id

        }

        new ApiService("sharedItems").add([sharedItem]).catch(console.log)

        if (deckOrDirectory.isDirectory) {
            DirectoryUtils.getInstance().update({
                ...deckOrDirectory,
                isShared: 1
            })
        } else {
            DeckUtils.getInstance().update({
                ...deckOrDirectory,
                isShared: 1
            })
        }

        this.close()
        this.snackbar(StaticText.DECK_SHARED, 4000)
    }
}