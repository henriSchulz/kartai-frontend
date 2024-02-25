import State from "../../../../types/State";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import LoadingBackdropFunction from "../../../../types/LoadingBackdropFunction";
import {NavigateFunction} from "react-router-dom";
import AuthenticationService from "../../../../services/AuthenticationService";
import {getTextFieldValue} from "../../../../utils/general";
import {StaticText} from "../../../../data/text/staticText";
import {SnackbarFunction} from "../../../../types/snackbar";

interface AuthenticationControllerOptions {
    states: {
        isSigningUpState: State<boolean>
        loadingState: State<boolean>
    },
    navigate: NavigateFunction
    loadingBackdrop: LoadingBackdropFunction
    snackbar: SnackbarFunction
}

export default class AuthenticationController {


    private navigate: NavigateFunction
    private loadingBackdrop: LoadingBackdropFunction
    public states: AuthenticationControllerOptions["states"]
    private snackbar: SnackbarFunction

    constructor(options: AuthenticationControllerOptions) {
        this.states = options.states
        this.navigate = options.navigate
        this.loadingBackdrop = options.loadingBackdrop
        this.snackbar = options.snackbar
    }


    onSignInWithGoogle = async () => {
        this.loadingBackdrop(true)
        await AuthenticationService.signInWithGoogle()
        this.loadingBackdrop(false)
    }


    onSubmit = async () => {
        if (this.states.isSigningUpState.val) {
            const email = getTextFieldValue("sign-up-email")
            const password = getTextFieldValue("sign-up-password")
            const confirmPassword = getTextFieldValue("sign-up-confirm-password")

            if (!email || !password || !confirmPassword) {
                this.states.loadingState.set(false)
                return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
            }

            if (password !== confirmPassword) {
                this.states.loadingState.set(false)
                return this.snackbar(StaticText.PASSWORDS_DO_NOT_MATCH, 5000, "error")
            }

            this.states.loadingState.set(true)
            try {
                await AuthenticationService.createWithEmailPassword(email, password)

            } catch (error: any) {
                this.states.loadingState.set(false)
                switch (error.code) {
                    case "auth/invalid-email": {
                        this.snackbar(StaticText.INVALID_EMAIL, 5000, "error")
                        break
                    }

                    case "auth/email-already-in-use": {
                        this.snackbar(StaticText.EMAIL_ALREADY_IN_USE, 5000, "error")
                        break
                    }

                    case "auth/weak-password": {
                        this.snackbar(StaticText.WEAK_PASSWORD, 5000, "error")
                        break
                    }
                }
            }
        } else {
            const email = getTextFieldValue("sign-in-email")
            const password = getTextFieldValue("sign-in-password")
            if (!email || !password) {
                this.states.loadingState.set(false)
                return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
            }

            this.states.loadingState.set(true)

            try {
                await AuthenticationService.signInWithEmailPassword(email, password)
            } catch (error: any) {
                this.states.loadingState.set(false)
                switch (error.code) {
                    case "auth/invalid-email": {
                        this.snackbar(StaticText.INVALID_EMAIL, 5000, "error")
                        break
                    }

                    case "auth/invalid-login-credentials": {
                        this.snackbar(StaticText.INVALID_LOGIN_CREDENTIALS, 5000, "error")
                        break
                    }
                }
            }
        }
    }


}