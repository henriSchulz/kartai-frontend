import EntityUtils from "./abstract/EntityUtils";
import FieldContent from "../types/dbmodel/FieldContent";
import {OmittedStoreSchema} from "../types/StoreSchema";
import store from "../stores/store";
import {fieldContentsSlice} from "../stores/slices";

export default class FieldContentUtils extends EntityUtils<FieldContent> {


    constructor() {
        const storeSchema: OmittedStoreSchema<FieldContent> = {
            fieldId: {type: "string", limit: 36, reference: "fields"},
            cardId: {type: "string", limit: 36, reference: "cards"},
            content: {type: "string", limit: 10000},
        }
        super("fieldContents", storeSchema, 1000, () =>store.getState().fieldContents.value, fieldContentsSlice);
    }

    private static instance: FieldContentUtils

     static getInstance(): FieldContentUtils {
        if (this.instance === undefined) {
            this.instance = new FieldContentUtils()
        }

        return this.instance
    }

}