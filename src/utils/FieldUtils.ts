import EntityUtils from "./abstract/EntityUtils";
import Field from "../types/dbmodel/Field";
import {OmittedStoreSchema} from "../types/StoreSchema";
import store from "../stores/store";
import {fieldsSlice} from "../stores/slices";
import FieldContentUtils from "./FieldContentUtils";
import {ID_PROPERTIES} from "./general";

export default class FieldUtils extends EntityUtils<Field> {
    constructor() {
        const storeSchema: OmittedStoreSchema<Field> = {
            name: {type: "string", limit: 100},
            cardTypeId: {type: "string", limit: ID_PROPERTIES.length, reference: "cardTypes"},

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

    public async delete(ids: string | string[]): Promise<void> {
        await FieldContentUtils.getInstance().deleteBy("fieldId", ids, {local: true})
        return super.delete(ids);
    }

}