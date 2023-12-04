import Client from "../types/Client";


import {getRedirectResult} from "firebase/auth";
import {auth} from "../data/firebaseConfig";
import RequestBuilder from "../lib/RequestBuilder";
import {Settings} from "../Settings";
import {LocalStorageKeys} from "../data/LocalStorageKeys";


export default class AuthenticationService {

    public static current: Client | null = null


    public static async init(): Promise<Error | null> {

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

            return null
        } else {
            return new Error("No current user found")
        }


    }

    public static async signOut(): Promise<void> {
        await auth.signOut()
    }


    public static async deleteClient() {
        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_HOST}/deleteClient`,
            method: "DELETE",
            token: this.current?.token
        })

        await request.send()

        Object.values(LocalStorageKeys).forEach(uuid => localStorage.removeItem(uuid as string))
    }


}