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
import CardUtils from "../../../../utils/CardUtils";
import {Limits} from "../../../../Settings";

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
        if (deckOrDirectory?.isDirectory) {
            const cardsCount = CardUtils.getInstance().getCardsByDirectoryId(deckOrDirectory.id).length
            if (cardsCount === 0) {
                return this.snackbar(StaticText.EMPTY_FOLDERS_CANNOT_BE_PUBLISHED, 4000, "error")
            }
            if (cardsCount > Limits.IMPORT_LIMIT) {
                return this.snackbar(StaticText.FOLDER_TOO_MANY_CARDS.replaceAll("{cards}", Limits.IMPORT_LIMIT.toString()), 4000, "error")
            }
        } else {
            const cardsCount = CardUtils.getInstance().getCardsByDeckId(deckOrDirectory!.id).length
            if (cardsCount === 0) {
                return this.snackbar(StaticText.EMPTY_DECKS_CANNOT_BE_PUBLISHED, 4000, "error")
            }
            if (cardsCount > Limits.IMPORT_LIMIT) {
                return this.snackbar(StaticText.DECK_TOO_MANY_CARDS.replaceAll("{cards}", Limits.IMPORT_LIMIT.toString()), 4000, "error")
            }
        }

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
            sharedItemName: deckOrDirectory.name,
            sharedItemId: deckOrDirectory.id,
            clientId: AuthenticationService.current!.id,
            downloads: 0
        }

        new ApiService("sharedItems").add([sharedItem]).catch(console.log)

        if (deckOrDirectory.isDirectory) {
            DirectoryUtils.getInstance().update({
                ...deckOrDirectory,
                isShared: 1
            })
            this.snackbar(StaticText.FOLDER_SHARED, 4000)
        } else {

            DeckUtils.getInstance().update({
                ...deckOrDirectory,
                isShared: 1
            })
            this.snackbar(StaticText.DECK_SHARED, 4000)
        }

        this.close()

    }
}