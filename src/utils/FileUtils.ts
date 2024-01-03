import RequestBuilder from "../lib/RequestBuilder";
import {Settings} from "../Settings";
import AuthenticationService from "../services/AuthenticationService";

export default class FileUtils {


    static async pdfToText(file: File): Promise<string | never> {
        const request = RequestBuilder.buildRequest({
            method: "POST",
            url: `${Settings.API_HOST}/files/extract-text-from-pdf`,
            token: AuthenticationService.current?.token,
            body: {
                file
            },
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        const response = await request.send<{ text: string }>()

        if (response.error || !response.data) throw response.error ?? new Error("No response data")

        return response.data.text
    }

    static async imageToText(file: File): Promise<string | never> {
        const request = RequestBuilder.buildRequest({
            method: "POST",
            url: `${Settings.API_HOST}/files/extract-text-from-image`,
            token: AuthenticationService.current?.token,
            body: {
                file
            },
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        const response = await request.send<{ text: string }>()

        if (response.error || !response.data) throw response.error ?? new Error("No response data")

        return response.data.text
    }


}