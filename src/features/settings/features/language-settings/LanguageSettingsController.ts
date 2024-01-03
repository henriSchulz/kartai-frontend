import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import State from "../../../../types/State";
import {LocalStorageKeys} from "../../../../data/LocalStorageKeys";

interface LanguageSettingsControllerOptions extends ModalControllerOptions {
    states: {
        showState: State<boolean>
        selectedLanguageState: State<string>
    }
}


export default class LanguageSettingsController extends ModalController<LanguageSettingsControllerOptions> {


    constructor(options: LanguageSettingsControllerOptions) {
        super(options);
    }

    open = () => {
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }

    submit = () => {
        localStorage.setItem(LocalStorageKeys.LANGUAGE, this.states.selectedLanguageState.val)
        window.location.reload()
    }

}