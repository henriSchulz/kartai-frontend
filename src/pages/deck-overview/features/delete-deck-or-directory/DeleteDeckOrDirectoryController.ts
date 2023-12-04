import DeckOverviewController from "../../DeckOverviewController";
import State from "../../../../types/State";
import {SnackbarFunction} from "../../../../types/snackbar";
import {DeckOrDirectory} from "../../../../types/DeckOrDirectory";
import store from "../../../../stores/store";
import {decksSlice, directoriesSlice} from "../../../../stores/slices";
import {StaticText} from "../../../../data/text/staticText";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import DeckUtils from "../../../../utils/DeckUtils";
import DirectoryUtils from "../../../../utils/DirectoryUtils";

interface DeleteDeckOrDirectoryControllerOptions extends ModalControllerOptions {
    deckOverviewController: DeckOverviewController
    snackbar: SnackbarFunction
}

export default class DeleteDeckOrDirectoryController extends ModalController<DeleteDeckOrDirectoryControllerOptions> {

    public deckOverviewController: DeckOverviewController

    constructor(options: DeleteDeckOrDirectoryControllerOptions) {
        super(options)
        this.deckOverviewController = options.deckOverviewController
    }

    getTexts = (): { title: string, text: string } => {
        if (this.deckOverviewController.entitiesSelected()) {


            const selectedTypes = this.deckOverviewController.getViewSelectionsTypes()

            if (selectedTypes === "deckAndDirectory") {
                return {
                    title: StaticText.DELETE_ITEMS.replaceAll("{items}", this.deckOverviewController.states.selectedEntitiesState.val.length.toString()),
                    text: StaticText.DELETE_ITEMS_TEXT
                }
            }

            if (selectedTypes === "directory") {
                return {
                    title: StaticText.DELETE_FOLDERS.replaceAll("{items}", this.deckOverviewController.states.selectedEntitiesState.val.length.toString()),
                    text: StaticText.DELETE_FOLDERS_TEXT
                }
            } else {
                return {
                    title: StaticText.DELETE_DECKS.replaceAll("{items}", this.deckOverviewController.states.selectedEntitiesState.val.length.toString()),
                    text: StaticText.DELETE_DECKS_TEXT
                }
            }


        }

        const selectedDeckOrDirectory = this.deckOverviewController.states.tempDeckOrDirectoryState.val
        if (selectedDeckOrDirectory?.isDirectory) {
            return {
                title: StaticText.DELETE_FOLDER,
                text: StaticText.DELETE_FOLDER_TEXT.replaceAll("{name}", selectedDeckOrDirectory?.name ?? "")
            }
        } else {
            return {
                title: StaticText.DELETE_DECK,
                text: StaticText.DELETE_DECK_TEXT.replaceAll("{name}", selectedDeckOrDirectory?.name ?? "")
            }
        }
    }

    open = (deckOrDirectory?: DeckOrDirectory) => {
        this.deckOverviewController.selectTempDeckOrDirectory(deckOrDirectory!)
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }

    submit = () => {
        if (this.deckOverviewController.entitiesSelected()) {
            const deckIdsToDelete: string[] = []
            const directoryIdsToDelete: string[] = []
            for (const selectedDeckOrDirectory of this.deckOverviewController.states.selectedEntitiesState.val) {
                if (selectedDeckOrDirectory.isDirectory) {
                    directoryIdsToDelete.push(selectedDeckOrDirectory.id)
                } else {
                    deckIdsToDelete.push(selectedDeckOrDirectory.id)
                }
            }
            DeckUtils.getInstance().delete(deckIdsToDelete)
            DirectoryUtils.getInstance().delete(directoryIdsToDelete)


            const viewSelectionsTypes = this.deckOverviewController.getViewSelectionsTypes()

            if (viewSelectionsTypes === "deckAndDirectory") {
                this.snackbar(StaticText.ELEMENTS_DELETED.replaceAll("{items}", this.deckOverviewController.states.selectedEntitiesState.val.length.toString()), 4000)
            } else if (viewSelectionsTypes === "deck") {
                this.snackbar(StaticText.DECKS_DELETED.replaceAll("{items}", this.deckOverviewController.states.selectedEntitiesState.val.length.toString()), 4000)
            } else {
                this.snackbar(StaticText.FOLDERS_DELETED.replaceAll("{items}", this.deckOverviewController.states.selectedEntitiesState.val.length.toString()), 4000)
            }

            this.deckOverviewController.states.selectedEntitiesState.set([])
        } else {
            const selectedDeckOrDirectory = this.deckOverviewController.getSelectedTempDeckOrDirectory()
            if (selectedDeckOrDirectory.isDirectory) {
                DirectoryUtils.getInstance().delete(selectedDeckOrDirectory.id)
                this.snackbar(StaticText.FOLDER_DELETED, 4000)
            } else {
                DeckUtils.getInstance().delete(selectedDeckOrDirectory.id)
                this.snackbar(StaticText.DECK_DELETED, 4000)
            }
        }
        this.close()
    }


}