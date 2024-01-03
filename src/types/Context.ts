import {SnackbarFunction} from "./snackbar";
import LoadingBackdropFunction from "./LoadingBackdropFunction";
import CardTypesController from "../features/card-types/CardTypesController";


namespace Context {


    export interface GlobalContext {
        topLevelInitDone: boolean
        snackbar: SnackbarFunction
        loadingBackdrop: LoadingBackdropFunction
        cardTypesController: CardTypesController
    }

}


export default Context


