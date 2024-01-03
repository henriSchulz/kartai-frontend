import State from "../../types/State";
import {SnackbarFunction} from "../../types/snackbar";
import LoadingBackdropFunction from "../../types/LoadingBackdropFunction";
import ApiService from "../../services/ApiService";
import SharedItem from "../../types/dbmodel/SharedItem";
import store from "../../stores/store";
import {sharedItemsSlice} from "../../stores/slices";

interface SharedItemsControllerOptions {
    snackbar: SnackbarFunction,
    loadingBackdrop: LoadingBackdropFunction,
    topLevelInitDone: boolean,
    states: {
        loadingState: State<boolean>
        tempSelectedSharedItemState: State<SharedItem | null>
    }
}


export default class SharedItemsController {


    public snackbar: SnackbarFunction
    public loadingBackdrop: LoadingBackdropFunction
    public topLevelInitDone: boolean
    public states: SharedItemsControllerOptions["states"]

    constructor(options: SharedItemsControllerOptions) {
        this.snackbar = options.snackbar
        this.loadingBackdrop = options.loadingBackdrop
        this.topLevelInitDone = options.topLevelInitDone
        this.states = options.states
    }


    public init = async () => {
        this.loadingBackdrop(true)
        if(!store.getState().sharedItems.isInitialized) {
            const sharedItems = await new ApiService<SharedItem>("sharedItems").loadAll()
            store.dispatch(sharedItemsSlice.actions.init(sharedItems))
        }
    }


    public selectedTempSharedItem = (sharedItem: SharedItem) => {
        this.states.tempSelectedSharedItemState.set(sharedItem)
    }


    public getTempSelectedSharedItem = (): SharedItem => {
        if (!this.states.tempSelectedSharedItemState.val) throw new Error("No temp selected shared item")
        return this.states.tempSelectedSharedItemState.val
    }

}