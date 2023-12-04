import State from "../../types/State";
import {SnackbarFunction} from "../../types/snackbar";

export interface ModalControllerOptions {
    states: {
        showState: State<boolean>
    },
    snackbar: SnackbarFunction
}


export default abstract class ModalController<T extends ModalControllerOptions> {

    public states: T["states"]
    public snackbar: SnackbarFunction

    protected constructor(options: T) {
        this.states = options.states
        this.snackbar = options.snackbar
    }


    public abstract open(): void

    public abstract close(): void

    public abstract submit(): void


}