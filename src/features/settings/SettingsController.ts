import ModalController, {ModalControllerOptions} from "../../controller/abstract/ModalController";


export default class SettingsController extends ModalController<ModalControllerOptions> {
    constructor(options: ModalControllerOptions) {
        super(options);
    }


    public open = () => {
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {


        this.close()
    }
}