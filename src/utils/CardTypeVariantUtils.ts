import EntityUtils from "./abstract/EntityUtils";
import CardTypeVariant from "../types/dbmodel/CardTypeVariant";
import {OmittedStoreSchema, StoreSchema} from "../types/StoreSchema";
import store from "../stores/store";
import {cardTypeVariantsSlice} from "../stores/slices";
import Field from "../types/dbmodel/Field";
import CardType from "../types/dbmodel/CardType";
import FieldUtils from "./FieldUtils";
import {ID_PROPERTIES} from "./general";

export default class CardTypeVariantUtils extends EntityUtils<CardTypeVariant> {
    constructor() {
        const storeSchema: OmittedStoreSchema<CardTypeVariant> = {
            name: {type: "string", limit: 100},
            cardTypeId: {type: "string", limit: ID_PROPERTIES.length, reference: "cardTypes"},
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


    public static generateDefaultTemplates(fields: Field[]): { templateFront: string, templateBack: string } {
        const fieldNames = fields.map(f => f.name)
        const templateFront = `{{${fieldNames[0]}}}`
        const templateBack = templateFront + `<hr>` + fieldNames.slice(1).map(s => `{{${s}}}`).join("<br>")
        return {templateFront, templateBack}
    }

    public static getFieldsInTemplate(cardType: CardType, template: string): Field[] {
        const fields = FieldUtils.getInstance().getAllBy("cardTypeId", cardType.id)
        const includedFields: Field[] = []
        for (const field of fields) {
            if (template.includes(`{{${field.name}}}`) || template.includes(`{{type:${field.name}}}`) || template.includes(`{{hanzi:${field.name}}}`)) {
                includedFields.push(field)
            }
        }
        return includedFields
    }
}