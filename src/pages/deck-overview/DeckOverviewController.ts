import {DeckOrDirectory} from "../../types/DeckOrDirectory";
import Directory from "../../types/dbmodel/Directory";
import Deck from "../../types/dbmodel/Deck";
import React from "react";
import {SnackbarFunction} from "../../types/snackbar"
import store from "../../stores/store";
import ViewEntitySelectionController from "../../controller/ViewEntitySelectionController";
import State from "../../types/State";
import ContextMenu from "../../types/ContextMenu";
import CardUtils from "../../utils/CardUtils";
import {StaticText} from "../../data/text/staticText";
import LoadingBackdropFunction from "../../types/LoadingBackdropFunction";
import ImportExportUtils from "../../utils/ImportExportUtils";


interface DeckOverviewControllerOptions {

    topLevelInitDone: boolean,

    states: {
        importMenuAnchorElState: State<HTMLElement | null>
        addMenuAnchorElState: State<HTMLElement | null>
        tempDeckOrDirectoryState: State<DeckOrDirectory | null>
        selectedEntitiesState: State<DeckOrDirectory[]>
        selectedEntitiesAnchorElState: State<DeckOrDirectory | null>
        currentDirectoryState: State<Directory | null>
        contextMenuState: State<ContextMenu>
        loadingState: State<boolean>
    },
    snackbar: SnackbarFunction,
    loadingBackdrop: LoadingBackdropFunction
}


// can only be used in the DeckOverviewPage component

export default class DeckOverviewController extends ViewEntitySelectionController<DeckOrDirectory> {

    public states: DeckOverviewControllerOptions["states"]

    public snackbar: SnackbarFunction

    public loadingBackdrop: LoadingBackdropFunction

    public kpkgFileSelectorId = "kpkg-file-selector"

    public csvFileSelectorId = "csv-file-selector"

    private topLevelInitDone: boolean


    public static initialContextMenuState = {
        show: false,
        x: 0,
        y: 0
    }

    constructor(options: DeckOverviewControllerOptions) {
        super({
            states: {
                selectedEntitiesState: options.states.selectedEntitiesState,
                selectedEntitiesAnchorElState: options.states.selectedEntitiesAnchorElState
            },
            viewItemsGetter: () => {
                const state = store.getState()
                return this.toDeckOverviewItems(
                    Array.from(state.directories.value.values()),
                    Array.from(state.decks.value.values())
                )
            }
        })
        this.states = options.states
        this.snackbar = options.snackbar
        this.loadingBackdrop = options.loadingBackdrop
        this.topLevelInitDone = options.topLevelInitDone
    }

    /**
     * Function to select a deck or directory temporarily (for modals)
     **/



    public selectTempDeckOrDirectory(deckOrDirectoryToSelect: DeckOrDirectory) {
        if (deckOrDirectoryToSelect === null) throw new Error("Invalid entity: the entity is not a deck or directory")
        if (deckOrDirectoryToSelect.id === this.states.tempDeckOrDirectoryState.val?.id) return
        this.states.tempDeckOrDirectoryState.set(deckOrDirectoryToSelect)
    }

    /**
     *  Function to get the selected deck or directory. Throws an error if no deck or directory is selected
     **/

    public getSelectedTempDeckOrDirectory(): DeckOrDirectory | never {
        if (this.states.tempDeckOrDirectoryState.val === null) throw new Error("No deck or directory selected")
        return this.states.tempDeckOrDirectoryState.val
    }


    public onOpenContextMenu(event: React.MouseEvent<HTMLDivElement>) {
        const {pageX, pageY} = event
        if (this.states.contextMenuState.val.show) return this.onCloseContextMenu()
        this.states.contextMenuState.set({
            show: true,
            x: pageX,
            y: pageY
        })
    }

    public onCloseContextMenu() {
        this.states.contextMenuState.set(DeckOverviewController.initialContextMenuState)
    }

    /**
     *
     * Toggle the selection of a deck or directory by the user in the deck overview page
     *
     */

    public getViewSelectionsTypes = (): ("deck" | "directory" | "deckAndDirectory") | never => {
        const selectedTypes: ("deck" | "directory")[] = []
        for (const selectedEntitiesStateElement of this.states.selectedEntitiesState.val) {
            if (selectedTypes.length === 2) break
            if (selectedEntitiesStateElement.isDirectory) {
                if (!selectedTypes.includes("directory")) selectedTypes.push("directory")
            } else {
                if (!selectedTypes.includes("deck")) selectedTypes.push("deck")
            }
        }

        if (selectedTypes.length === 0) throw new Error("No entities selected")

        if (selectedTypes.length === 2) return "deckAndDirectory"

        if (selectedTypes.includes("deck")) return "deck"

        return "directory"
    }


    public toDeckOverviewItems(directories: Directory[], decks: Deck[]): DeckOrDirectory[] {
        const items: DeckOrDirectory[] = []

        for (const dir of directories) {
            items.push({
                ...dir,
                isDirectory: true
            })
        }

        for (const deck of decks) {
            items.push({
                ...deck,
                isDirectory: false
            })
        }


        return items.filter(item => {
            const currentDirectory = this.states.currentDirectoryState.val
            if (!item.parentId && !currentDirectory) return true
            return currentDirectory?.id === item.parentId;
        })
    }


    /**
     *
     * Returns true if a deck or directory is selected by the user
     *
     **/

    public entitiesSelected(): boolean {
        return this.states.selectedEntitiesState.val.length > 0
    }


    public getTextFieldValue(id: string): string {
        const element = document.getElementById(id) as HTMLInputElement
        return element.value
    }


    public toggleLoading() {
        this.states.loadingState.set(prev => !prev)
    }


    //arrow function to bind this to the class

    public openAddMenu = (event: React.MouseEvent<HTMLElement>) => {
        this.states.addMenuAnchorElState.set(event.currentTarget)
    }

    //arrow function to bind this to the class

    public closeAddMenu = () => {
        this.states.addMenuAnchorElState.set(null)
    }

    //arrow function to bind this to the class

    public openImportMenu = (event: React.MouseEvent<HTMLElement>) => {
        this.states.importMenuAnchorElState.set(event.currentTarget)
    }

    //arrow function to bind this to the class

    public closeImportMenu = () => {
        this.states.importMenuAnchorElState.set(null)
    }

    //arrow function to bind this to the class

    public onUploadKpkgFile = async (files: File[]) => {
        const maxCardCount = CardUtils.getInstance().maxClientSize
        const cardCount = CardUtils.getInstance().getSize()

        if (cardCount >= maxCardCount) {
            return this.snackbar(StaticText.STORAGE_LIMIT.replaceAll("{x}", maxCardCount.toString()), 4000, "error")
        }

        if (!files) return;
        if (files.length < 0) return;

        let successfullyImportedFile = 0

        this.loadingBackdrop(true)

        for (const file of files) {
            if (file.size > 4 * 1024 * 1024) {
                this.snackbar(StaticText.FILE_TOO_BIG.replaceAll("{name}", file.name), 5000, "error");
                return this.loadingBackdrop(false)
            }
            const fileContent: string = await file.text()
            const result = ImportExportUtils.importFromJson(fileContent)

            if (!result) {
                this.snackbar(StaticText.INVALID_FILE_FORMAT.replaceAll("{name}", file.name), 5000, "error");
            } else successfullyImportedFile++
        }

        if (successfullyImportedFile > 0) {
            if (successfullyImportedFile === 1) {
                this.snackbar(StaticText.ITEM_SUCCESSFULLY_IMPORTED, 5000, "success");
            } else {
                this.snackbar(StaticText.ITEMS_SUCCESSFULLY_IMPORTED.replaceAll("{items}", successfullyImportedFile.toString()), 5000, "success");
            }
        }

        this.loadingBackdrop(false)
    }

    //arrow function to bind this to the class

    public onOpenKpkgFileSelector = () => {
        const input = document.getElementById(this.kpkgFileSelectorId) as HTMLInputElement
        if (input) input.click()
    }

    //arrow function to bind this to the class

    public onOpenCsvFileSelector = () => {
        const input = document.getElementById(this.csvFileSelectorId) as HTMLInputElement
        if (input) input.click()
    }
}