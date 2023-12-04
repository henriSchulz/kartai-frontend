import EntityUtils from "./abstract/EntityUtils";
import Field from "../types/dbmodel/Field";
import {OmittedStoreSchema} from "../types/StoreSchema";
import store from "../stores/store";
import {fieldsSlice} from "../stores/slices";

export default class FieldUtils extends EntityUtils<Field> {
    constructor() {
        const storeSchema: OmittedStoreSchema<Field> = {
            name: {type: "string", limit: 100},
            cardTypeId: {type: "string", limit: 36, reference: "cardTypes"},

        }
        super("fields", storeSchema, 1000, () => store.getState().fields.value, fieldsSlice);
    }

    private static instance: FieldUtils

     static getInstance(): FieldUtils {
        if (this.instance === undefined) {
            this.instance = new FieldUtils()
        }

        return this.instance
    }

}