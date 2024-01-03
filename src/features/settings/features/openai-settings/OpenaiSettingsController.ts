import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import State from "../../../../types/State";
import {getTextFieldValue} from "../../../../utils/general";
import {StaticText} from "../../../../data/text/staticText";
import OpenaiApiService from "../../../../services/OpenaiApiService";
import {LocalStorageKeys} from "../../../../data/LocalStorageKeys";

interface OpenaiSettingsControllerOptions extends ModalControllerOptions {
    states: {
        showState: State<boolean>
        selectedGptVersionState: State<string>
        loadingState: State<boolean>
    }
}


export default class OpenaiSettingsController extends ModalController<OpenaiSettingsControllerOptions> {

    constructor(options: OpenaiSettingsControllerOptions) {
        super(options);
    }

    public submit = async () => {
        const openAIKey = getTextFieldValue("openai-key")
        if (!openAIKey || openAIKey.length === 0) {
            return this.snackbar(StaticText.INVALID_APIKEY, 6000, "error")
        }

        this.states.loadingState.set(true)


        if (!(await OpenaiApiService.isValidOpenAIAPIKey(openAIKey))) {
            this.states.loadingState.set(false)
            return this.snackbar(StaticText.INVALID_APIKEY, 6000, "error")
        }

        this.states.loadingState.set(false)

        localStorage.setItem(LocalStorageKeys.OPENAI_KEY, openAIKey)
        localStorage.setItem(LocalStorageKeys.GPT_VERSION, this.states.selectedGptVersionState.val)
        window.location.reload()
    }


    public open = () => {
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }
}