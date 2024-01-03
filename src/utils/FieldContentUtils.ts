import EntityUtils from "./abstract/EntityUtils";
import FieldContent from "../types/dbmodel/FieldContent";
import {OmittedStoreSchema} from "../types/StoreSchema";
import store from "../stores/store";
import {fieldContentsSlice} from "../stores/slices";
import FieldContentPair from "../types/FieldContentPair";
import FieldUtils from "./FieldUtils";
import CardUtils from "./CardUtils";
import {ID_PROPERTIES} from "./general";

export default class FieldContentUtils extends EntityUtils<FieldContent> {


    constructor() {
        const storeSchema: OmittedStoreSchema<FieldContent> = {
            fieldId: {type: "string", limit: ID_PROPERTIES.length, reference: "fields"},
            cardId: {type: "string", limit: ID_PROPERTIES.length, reference: "cards"},
            content: {type: "string", limit: 10000},
        }
        super("fieldContents", storeSchema, 1000, () => store.getState().fieldContents.value, fieldContentsSlice);
    }

    private static instance: FieldContentUtils

    static getInstance(): FieldContentUtils {
        if (this.instance === undefined) {
            this.instance = new FieldContentUtils()
        }

        return this.instance
    }

    public getFieldContentPairs(cardId: string): FieldContentPair[] {
        const card = CardUtils.getInstance().getById(cardId)
        const fieldContents = this.getAllBy("cardId", cardId)
        return FieldUtils.getInstance().getAllBy("cardTypeId", card.cardTypeId).map(field => {
            const fieldContent = fieldContents.find(fieldContent => fieldContent.fieldId === field.id)!
            return {field, fieldContent}
        })
    }


    //return fieldContentPairs of a random card that has the cardType (for preview purposes in card type editor)
    public getFieldContentPairsByCardTypeId(cardTypeId: string): FieldContentPair[] {
        try {
            const card = CardUtils.getInstance().get("cardTypeId", cardTypeId)
            const fieldContents = this.getAllBy("cardId", card.id)
            return FieldUtils.getInstance().getAllBy("cardTypeId", cardTypeId).map(field => {
                const fieldContent = fieldContents.find(fieldContent => fieldContent.fieldId === field.id)!
                return {field, fieldContent}
            })
        } catch (error) {
            return []
        }
    }


}