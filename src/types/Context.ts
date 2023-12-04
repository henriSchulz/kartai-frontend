import {SnackbarFunction} from "./snackbar";
import LoadingBackdropFunction from "./LoadingBackdropFunction";


namespace Context {


    export interface GlobalContext {
        topLevelInitDone: boolean
        snackbar: SnackbarFunction
        loadingBackdrop: LoadingBackdropFunction
    }

}


export default Context


