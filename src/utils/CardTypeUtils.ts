import EntityUtils from "./abstract/EntityUtils";
import CardType from "../types/dbmodel/CardType";
import {OmittedStoreSchema} from "../types/StoreSchema";
import store from "../stores/store";
import {cardTypesSlice} from "../stores/slices";
import CardTypeVariant from "../types/dbmodel/CardTypeVariant";
import Field from "../types/dbmodel/Field";
import CardTypeVariantUtils from "./CardTypeVariantUtils";
import FieldUtils from "./FieldUtils";
import EntityUtilsFuncOptions from "../types/EntityUtilsFuncOptions";

export default class CardTypeUtils extends EntityUtils<CardType> {
    constructor() {

        const storeSchema: OmittedStoreSchema<CardType> = {
            name: {type: "string", limit: 100},

        }
        super("cardTypes", storeSchema, 1000, () => store.getState().cardTypes.value, cardTypesSlice);
    }


    private static instance: CardTypeUtils

    public static getInstance(): CardTypeUtils {
        if (this.instance === undefined) {
            this.instance = new CardTypeUtils()
        }

        return this.instance
    }

    public async addCardTypesAndVariantsAndFields(cardTypes: CardType[], cardTypeVariants: CardTypeVariant[], fields: Field[], options: EntityUtilsFuncOptions = {
        local: true,
        api: true
    }): Promise<void> {
        await this.add(cardTypes, options)

        await CardTypeVariantUtils.getInstance().add(cardTypeVariants, options)

        await FieldUtils.getInstance().add(fields, options)
    }

    public hasDefaultCardType(prefix: string): boolean {
        for (const entity of Array.from(this.entities.values())) {
            if (entity.id.startsWith(prefix)) return true
        }
        return false
    }

}