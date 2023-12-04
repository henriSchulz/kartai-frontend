import {SnackbarFunction} from "../../../../types/snackbar";
import DeckUtils from "../../../../utils/DeckUtils";
import {StaticText} from "../../../../data/text/staticText";
import store from "../../../../stores/store";
import {decksSlice, directoriesSlice} from "../../../../stores/slices";
import {generateModelId} from "../../../../utils/general";
import DirectoryUtils from "../../../../utils/DirectoryUtils";
import DeckOverviewController from "../../DeckOverviewController";
import State from "../../../../types/State";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";


interface NewDeckOrDirectoryControllerOptions extends ModalControllerOptions {
    deckOverviewController: DeckOverviewController
    states: {
        showState: State<boolean>
        isCreatingDeckState: State<boolean>
    },
    snackbar: SnackbarFunction
}

export default class NewDeckOrDirectoryController extends ModalController<NewDeckOrDirectoryControllerOptions> {


    private deckOverviewController: NewDeckOrDirectoryControllerOptions["deckOverviewController"]

    constructor(options: NewDeckOrDirectoryControllerOptions) {
        super(options)
        this.deckOverviewController = options.deckOverviewController
    }

    open = (isDeck?: boolean) => {
        this.states.isCreatingDeckState.set(isDeck!)
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }


    submit = () => {
        const deckOrDirectoryName = this.deckOverviewController.getTextFieldValue("deckOrDirectoryName")
        if (deckOrDirectoryName.replaceAll(" ", "") === "") {
            return this.snackbar(StaticText.FIELD_EMPTY, 4000, "error")
        }
        const maxNameLength = DeckUtils.getInstance().storeSchema.name.limit
        if (deckOrDirectoryName.length > maxNameLength) {
            return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", maxNameLength.toString()), 4000, "error")
        }


        if (this.states.isCreatingDeckState.val) {
            if (DeckUtils.getInstance().canAdd(1)) {
                const deck = {
                    id: generateModelId(),
                    name: deckOrDirectoryName,
                    parentId: this.deckOverviewController.states.currentDirectoryState.val?.id ?? null,
                    isShared: 0,
                }
                DeckUtils.getInstance().add(deck)
                this.snackbar(StaticText.DECK_ADDED, 4000)
                this.close()
            } else {
                this.snackbar(StaticText.MAX_DECKS_REACHED, 4000, "error")
            }
        } else {
            if (DirectoryUtils.getInstance().canAdd(1)) {
                const directory = {
                    id: generateModelId(),
                    name: deckOrDirectoryName,
                    parentId: this.deckOverviewController.states.currentDirectoryState.val?.id ?? null,
                    isShared: 0,
                }
                DirectoryUtils.getInstance().add(directory)
                this.snackbar(StaticText.FOLDER_ADDED, 4000)
                this.close()
            } else {
                this.snackbar(StaticText.MAX_FOLDERS_REACHED, 4000, "error")
            }
        }
    }
}