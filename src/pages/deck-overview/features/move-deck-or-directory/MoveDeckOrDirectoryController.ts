import State from "../../../../types/State";
import {SnackbarFunction} from "../../../../types/snackbar";
import DeckOverviewController from "../../DeckOverviewController";
import {DeckOrDirectory} from "../../../../types/DeckOrDirectory";

import store from "../../../../stores/store";
import {decksSlice, directoriesSlice} from "../../../../stores/slices";
import {StaticText} from "../../../../data/text/staticText";
import Deck from "../../../../types/dbmodel/Deck";
import Directory from "../../../../types/dbmodel/Directory";
import DirectoryUtils from "../../../../utils/DirectoryUtils";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import DeckUtils from "../../../../utils/DeckUtils";

interface MoveDeckOrDirectoryControllerOptions extends ModalControllerOptions {
    states: {
        showState: State<boolean>
        selectedDestinationDirectoryIdState: State<string>
    },
    snackbar: SnackbarFunction,
    deckOverviewController: DeckOverviewController
}

export default class MoveDeckOrDirectoryController extends ModalController<MoveDeckOrDirectoryControllerOptions> {

    public readonly deckOverviewController: MoveDeckOrDirectoryControllerOptions["deckOverviewController"]

    constructor(options: MoveDeckOrDirectoryControllerOptions) {
        super(options)
        this.deckOverviewController = options.deckOverviewController
    }

    getTexts = (): { title: string } => {
        if (!this.states.showState.val) return {title: ""}

        if (this.deckOverviewController.entitiesSelected()) {


            const selectedTypes = this.deckOverviewController.getViewSelectionsTypes()

            if (selectedTypes === "deckAndDirectory") {
                return {
                    title: StaticText.MOVE_ITEMS.replaceAll("{items}", this.deckOverviewController.states.selectedEntitiesState.val.length.toString()),

                }
            }

            if (selectedTypes === "directory") {
                return {
                    title: StaticText.MOVE_FOLDERS.replaceAll("{items}", this.deckOverviewController.states.selectedEntitiesState.val.length.toString()),

                }
            } else {
                return {
                    title: StaticText.MOVE_DECKS.replaceAll("{items}", this.deckOverviewController.states.selectedEntitiesState.val.length.toString()),
                }
            }


        }

        const selectedDeckOrDirectory = this.deckOverviewController.states.tempDeckOrDirectoryState.val
        if (selectedDeckOrDirectory?.isDirectory) {
            return {
                title: StaticText.MOVE_FOLDER,
            }
        } else {
            return {
                title: StaticText.MOVE_DECK,
            }
        }
    }

    open(deckOrDirectory?: DeckOrDirectory) {
        this.deckOverviewController.selectTempDeckOrDirectory(deckOrDirectory!)
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }

    submit = () => {
        let dirId: string | null = this.states.selectedDestinationDirectoryIdState.val
        dirId = dirId === "HOME" ? null : dirId
        let dir = dirId ? DirectoryUtils.getInstance().getById(dirId) : null


        if (!this.deckOverviewController.entitiesSelected()) {
            const deckOrDirectory = this.deckOverviewController.getSelectedTempDeckOrDirectory()
            if (deckOrDirectory.isDirectory) {
                store.dispatch(directoriesSlice.actions.update({
                    ...deckOrDirectory,
                    parentId: dirId
                }))
                this.snackbar(StaticText.FOLDER_MOVED_TO.replaceAll("{dir}", dir ? dir.name : "/")
                    , 4000)
            } else {
                store.dispatch(decksSlice.actions.update({
                    ...deckOrDirectory,
                    parentId: dirId
                }))
                this.snackbar(StaticText.DECK_MOVED_TO.replaceAll("{dir}", dir ? dir.name : "/"),
                    4000)
            }
        } else {
            const selectedEntities = this.deckOverviewController.states.selectedEntitiesState.val
            const decksToUpdate: Deck[] = []
            const directoriesToUpdate: Directory[] = []
            for (const deckOrDirectory of selectedEntities) {
                if (deckOrDirectory.isDirectory) {
                    directoriesToUpdate.push({
                        ...deckOrDirectory,
                        parentId: dirId
                    })
                } else {
                    decksToUpdate.push({
                        ...deckOrDirectory,
                        parentId: dirId
                    })
                }
            }

            DeckUtils.getInstance().update(decksToUpdate)
            DirectoryUtils.getInstance().update(directoriesToUpdate)

            const entitiesTypes = this.deckOverviewController.getViewSelectionsTypes()

            if (entitiesTypes === "deck") {
                this.snackbar(StaticText.DECKS_MOVED_TO.replaceAll("{dir}", dir ? dir.name : "/")
                    , 4000)
            } else if (entitiesTypes === "directory") {
                this.snackbar(StaticText.FOLDERS_MOVED_TO.replaceAll("{dir}", dir ? dir.name : "/")
                    , 4000)
            } else {
                this.snackbar(StaticText.ITEMS_MOVED_TO.replaceAll("{dir}", dir ? dir.name : "/")
                    , 4000)
            }


        }


        this.close()
    }


    getPossibleDestinationDirectories = (): Directory[] => {
        const selectedDeckviewItems = this.deckOverviewController.states.selectedEntitiesState.val
        const selectedTempEntity = this.deckOverviewController.states.tempDeckOrDirectoryState.val
        const currentDeckViewItemType = selectedTempEntity?.isDirectory ? "directory" : "deck"
        return [...DirectoryUtils.getInstance().toArray(), {id: "HOME", parentId: null, name: "/"} as Directory]
            .filter(e => {
                if (selectedDeckviewItems.length > 1) {
                    for (let i = 0; i < selectedDeckviewItems.length; i++) {
                        const item = selectedDeckviewItems[i]
                        if (!item.isDirectory) {
                            const curr = item as Deck
                            if (e.id === curr?.parentId) return false
                            if (e.id === "HOME" && !curr?.parentId) return false
                        } else {
                            const curr = item as Directory
                            if (e.id === curr?.id) return false
                            if (e.id === curr?.parentId) return false
                            if (e.id === "HOME" && !curr?.parentId) return false
                            const subDirs = DirectoryUtils.getInstance().getSubDirectories(curr.id)
                            if (subDirs?.some(subDir => subDir.id === e.id)) return false
                        }
                    }
                    return true
                } else {
                    if (currentDeckViewItemType === "deck") {
                        const curr = selectedTempEntity as Deck
                        if (e.id === curr?.parentId) return false
                        return !(e.id === "HOME" && !curr?.parentId);

                    } else {
                        const curr = selectedTempEntity as Directory
                        if (e.id === curr?.id) return false
                        if (e.id === curr?.parentId) return false
                        if (e.id === "HOME" && !curr?.parentId) return false
                        const subDirs = DirectoryUtils.getInstance().getSubDirectories(curr?.id)
                        return !subDirs.some(subDir => subDir.id === e.id)
                    }
                }
            })
    }


}