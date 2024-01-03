import {Settings} from "../Settings";
import RequestBuilder from "../lib/RequestBuilder";
import AuthenticationService from "./AuthenticationService";


export default class CraftImportService {

    public static async importCraftTable(url: string, numOfColumns: number): Promise<string[][] | null> {
        const request = RequestBuilder.buildRequest({
            method: "POST",
            url: `${Settings.API_HOST}/cards/import-from-craft`,
            token: AuthenticationService.current?.token,
            body: {
                craftUrl: url,
                numOfColumns
            }
        })

        const res = await request.send<{ table?: string[][], error?: string }>()

        if (res.error || !res.data) return null

        if (res.data.error || !res.data.table) return null

        return res.data.table
    }

}