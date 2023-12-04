import EntityUtils from "./abstract/EntityUtils";
import CardTypeVariant from "../types/dbmodel/CardTypeVariant";
import {OmittedStoreSchema, StoreSchema} from "../types/StoreSchema";
import store from "../stores/store";
import {cardTypeVariantsSlice} from "../stores/slices";

export default class CardTypeVariantUtils extends EntityUtils<CardTypeVariant> {
    constructor() {
        const storeSchema: OmittedStoreSchema<CardTypeVariant> = {
            name: {type: "string", limit: 100},
            cardTypeId: {type: "string", limit: 36, reference: "cardTypes"},
            templateFront: {type: "string", limit: 1000},
            templateBack: {type: "string", limit: 1000}
        }

        super("cardTypeVariants", storeSchema, 1000, () => store.getState().cardTypeVariants.value, cardTypeVariantsSlice);
    }

    private static instance: CardTypeVariantUtils

    public static getInstance(): CardTypeVariantUtils {
        if (this.instance === undefined) {
            this.instance = new CardTypeVariantUtils()
        }

        return this.instance
    }
}