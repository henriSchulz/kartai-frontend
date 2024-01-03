import EntityUtils from "./abstract/EntityUtils";
import SharedItem from "../types/dbmodel/SharedItem";
import {OmittedStoreSchema} from "../types/StoreSchema";
import {ID_PROPERTIES} from "./general";
import store from "../stores/store";
import {sharedItemsSlice} from "../stores/slices";
import FieldUtils from "./FieldUtils";
import RequestBuilder from "../lib/RequestBuilder";
import {Settings} from "../Settings";
import AuthenticationService from "../services/AuthenticationService";
import ImportExportObject from "../types/ImportExportObject";


export default class SharedItemsUtils extends EntityUtils<SharedItem> {

    constructor() {
        const storeSchema: OmittedStoreSchema<SharedItem> = {
            sharedItemId: {type: "string", limit: ID_PROPERTIES.length},
            clientId: {type: "string", limit: ID_PROPERTIES.length},
            sharedItemName: {type: "string", limit: 100},
            downloads: {type: "number", limit: 10e20},
        }
        super("sharedItems", storeSchema, 1000, () => store.getState().sharedItems.value, sharedItemsSlice)
    }

    private static instance: SharedItemsUtils

    static getInstance(): SharedItemsUtils {
        if (this.instance === undefined) {
            this.instance = new SharedItemsUtils()
        }

        return this.instance
    }


    public async transferSharedItem(sharedItemId: string): Promise<void | never> {
        const request = RequestBuilder.buildRequest({
            url: Settings.API_HOST + `/sharedItems/transfer`,
            token: AuthenticationService.current?.token,
            method: "POST",
            body: {id: sharedItemId}
        })

        const res = await request.send()

        if (res.error) throw new Error(res.error)
    }

    public async getSharedItemDownload(sharedItemId: string): Promise<ImportExportObject | never> {
        const request = RequestBuilder.buildRequest({
            url: Settings.API_HOST + `/sharedItems/${sharedItemId}`,
            token: AuthenticationService.current?.token,
            method: "GET",
        })

        const res = await request.send<{ download: ImportExportObject }>()

        if (res.error) throw new Error(res.error)

        if (!res.data?.download) throw new Error("No download found")

        return res.data.download
    }

    public async deleteBySharedItemId(sharedItemIds: string[]): Promise<void | never> {
        if (store.getState().sharedItems.isInitialized) {
            return this.deleteBy("sharedItemId", sharedItemIds)
        } else {
            const request = RequestBuilder.buildRequest({
                url: Settings.API_HOST + `/sharedItems/deleteBySharedItem`,
                token: AuthenticationService.current?.token,
                method: "POST",
                body: {ids: sharedItemIds}
            })

            const res = await request.send()

            if (res.error) throw new Error(res.error)
        }

    }

}