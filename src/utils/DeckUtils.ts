import store from "../stores/store";
import Deck from "../types/dbmodel/Deck";
import EntityUtils from "./abstract/EntityUtils";
import {OmittedStoreSchema} from "../types/StoreSchema";
import {decksSlice} from "../stores/slices";


export default class DeckUtils extends EntityUtils<Deck> {

    constructor() {
        const storeSchema: OmittedStoreSchema<Deck> = {
            name: {type: "string", limit: 100},
            parentId: {type: "string", limit: 36, reference: "directories", nullable: true},
            isShared: {type: "number", limit: 1}
        }

        super("decks", storeSchema, 1000, () => store.getState().decks.value, decksSlice)
    }


    static instance: DeckUtils

    static getInstance(): DeckUtils {
        if (this.instance === undefined) {
            this.instance = new DeckUtils()
        }

        return this.instance
    }


    public getDecksByParentId(directoryId: string): Deck[] {
        return this.toArray().filter(e => e.parentId === directoryId)
    }




}

