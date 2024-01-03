import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import AuthenticationService from "../../../../services/AuthenticationService";
import State from "../../../../types/State";

interface DeleteClientControllerOptions extends ModalControllerOptions {
    states: {
        loadingState: State<boolean>
        showState: State<boolean>
    }
}

export default class DeleteClientController extends ModalController<DeleteClientControllerOptions> {

    constructor(options: DeleteClientControllerOptions) {
        super(options)
    }

    open = () => {
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }

    submit = async () => {
        this.states.loadingState.set(true)
        await AuthenticationService.deleteClient()
        this.states.loadingState.set(false)
        this.close()
    }
}