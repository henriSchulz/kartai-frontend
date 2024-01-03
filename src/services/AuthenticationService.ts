import Client from "../types/Client";


import {createUserWithEmailAndPassword, getRedirectResult} from "firebase/auth";
import {auth, provider} from "../config/firebaseConfig";
import RequestBuilder from "../lib/RequestBuilder";
import {Settings} from "../Settings";
import {LocalStorageKeys} from "../data/LocalStorageKeys";
import {wait} from "../utils/general";
import {signInWithPopup, signInWithEmailAndPassword} from "firebase/auth";


export default class AuthenticationService {

    public static current: Client | null = null

    // returns true if the user is logged in

    public static async init(): Promise<boolean> {

        await getRedirectResult(auth)

        const googleUser = auth.currentUser

        if (googleUser) {
            const idToken = await googleUser.getIdToken()

            this.current = {
                userName: googleUser!.displayName ?? undefined,
                email: googleUser!.email ?? "",
                id: googleUser!.uid,
                token: idToken,
                imgUrl: googleUser!.photoURL ?? ""
            }

            return true
        } else {
            return false
        }
    }

    public static async signInWithGoogle(): Promise<void> {
        await signInWithPopup(auth, provider)
        await wait(100)
        window.location.href = "/deck-overview"
    }

    public static async signInWithEmailPassword(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(auth, email, password)
        await wait(100)
        window.location.href = "/deck-overview"
    }

    public static async createWithEmailPassword(email: string, password: string): Promise<void> {
        await createUserWithEmailAndPassword(auth, email, password)
        await wait(100)
        window.location.href = "/deck-overview"
    }

    public static async signOut(): Promise<void> {
        await auth.signOut()
        window.location.href = "/"
    }


    public static async deleteClient() {
        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_HOST}/deleteClient`,
            method: "DELETE",
            token: this.current?.token
        })

        await request.send()

        Object.values(LocalStorageKeys).forEach(uuid => localStorage.removeItem(uuid as string))
        window.location.href = "/"
    }


}