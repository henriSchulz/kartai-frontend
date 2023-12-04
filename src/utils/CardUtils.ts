import Card from "../types/dbmodel/Card";
import store from "../stores/store";
import DeckUtils from "./DeckUtils";
import DirectoryUtils from "./DirectoryUtils";
import EntityUtils from "./abstract/EntityUtils";
import {OmittedStoreSchema} from "../types/StoreSchema";
import {cardsSlice} from "../stores/slices";
import FieldContent from "../types/dbmodel/FieldContent";
import FieldContentUtils from "./FieldContentUtils";


export default class CardUtils extends EntityUtils<Card> {


    constructor() {
        const storeSchema: OmittedStoreSchema<Card> = {
            deckId: {type: "string", limit: 36, reference: "decks"},
            cardTypeId: {type: "string", limit: 36, reference: "cardTypes"},
            dueAt: {type: "number", limit: 10e20},
            learningState: {type: "number", limit: 10e20},
            paused: {type: "number", limit: 1}
        }

        super("cards", storeSchema, 1000, () => store.getState().cards.value, cardsSlice)
    }

    static instance: CardUtils

    static getInstance(): CardUtils {
        if (this.instance === undefined) {
            this.instance = new CardUtils()
        }

        return this.instance
    }


    static getCardLevel(card: Card): "new" | "learning" | "review" {
        if (card.learningState === 0) {
            return "new";
        }

        if (card.learningState > 0 && card.learningState < 5) {
            return "learning";
        }

        return "review"
    }

    getCardsByDeckId(deckId: string): Card[] {
        return this.toArray().filter(e => e.deckId === deckId)
    }

    getCardsByDirectoryId(directoryId: string): Card[] {
        const cards: Card[] = []
        const decks = new DirectoryUtils().getSubDecks(directoryId)

        for (const deck of decks) {
            cards.push(...this.getCardsByDeckId(deck.id))
        }
        return cards
    }

    getCardLearningStatesByDeckId(deckId: string): { newCards: number, learningCards: number, reviewCards: number } {
        return this.getCardLearningStates(this.getCardsByDeckId(deckId))
    }

    getCardLearningStatesByDirectoryId(directoryId: string): { newCards: number, learningCards: number, reviewCards: number } {
        return this.getCardLearningStates(this.getCardsByDirectoryId(directoryId))
    }


    private getCardLearningStates(cards: Card[]): { newCards: number, learningCards: number, reviewCards: number } {
        let newCards = 0
        let learningCards = 0
        let reviewCards = 0
        for (const card of cards) {
            if (card.paused) continue;
            if (card.dueAt > Date.now()) continue;
            switch (CardUtils.getCardLevel(card)) {
                case "new":
                    newCards++
                    break;
                case "learning":
                    learningCards++
                    break;
                case "review":
                    reviewCards++
                    break;
            }
        }
        return {
            newCards,
            learningCards,
            reviewCards
        }
    }


    public async addCardsAndFieldContents(cards: Card[], fieldContents: FieldContent[]): Promise<void> {
        await this.add(cards)

        await FieldContentUtils.getInstance().add(fieldContents)
    }


}


