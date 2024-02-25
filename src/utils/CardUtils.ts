import Card from "../types/dbmodel/Card";
import store from "../stores/store";
import DeckUtils from "./DeckUtils";
import DirectoryUtils from "./DirectoryUtils";
import EntityUtils from "./abstract/EntityUtils";
import {OmittedStoreSchema} from "../types/StoreSchema";
import {cardsSlice} from "../stores/slices";
import FieldContent from "../types/dbmodel/FieldContent";
import FieldContentUtils from "./FieldContentUtils";
import StudyCard from "../types/StudyCard";
import CardTypeVariantUtils from "./CardTypeVariantUtils";
import {ID_PROPERTIES} from "./general";
import EntityUtilsFuncOptions from "../types/EntityUtilsFuncOptions";


export default class CardUtils extends EntityUtils<Card> {


    constructor() {
        const storeSchema: OmittedStoreSchema<Card> = {
            deckId: {type: "string", limit: ID_PROPERTIES.length, reference: "decks"},
            cardTypeId: {type: "string", limit: ID_PROPERTIES.length, reference: "cardTypes"},
            dueAt: {type: "number", limit: 10e20},
            learningState: {type: "number", limit: 10e20},
            paused: {type: "number", limit: 1}
        }

        super("cards", storeSchema, 10000, () => store.getState().cards.value, cardsSlice)
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

    static getCardStatus(card: Card): "due" | "done" | "paused" {
        if (card.paused) return "paused"
        if (card.dueAt > Date.now()) return "done"
        return "due"
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

    getCardLearningStatesSumByDirectoryId(directoryId?: string): number {
        if (!directoryId) return 0
        const states = this.getCardLearningStatesByDirectoryId(directoryId)
        return states.newCards + states.learningCards + states.reviewCards
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


    public async addCardsAndFieldContents(cards: Card[], fieldContents: FieldContent[], options: EntityUtilsFuncOptions = {
        local: true,
        api: true
    }): Promise<void> {
        if (options.local) {
            this.add(cards, {local: true, api: false})
            FieldContentUtils.getInstance().add(fieldContents, {local: true, api: false})
        }

        if (options.api) {
            await this.add(cards, {local: false, api: true})
            await FieldContentUtils.getInstance().add(fieldContents, {local: false, api: true})
        }
    }

    public getNextDueCard(deckId: string): Card | null {
        const cards = this.getCardsByDeckId(deckId).filter(e => e.dueAt > Date.now()).sort((a, b) => b.dueAt - a.dueAt)
        if (cards.length === 0) return null
        return cards[cards.length - 1]
    }

    public static toLearningCards(cards: Card[]): Card[] {
        return cards.filter(e => e.dueAt < Date.now() && !e.paused)
    }

    public static calcNextLearningState(card: Card, rating: 0 | 1 | 2 | 3): number {
        if (card.learningState === 0) {
            if (rating === 0) {
                return 0
            }
            if (rating === 1) {
                return 1
            }
        }

        if (card.learningState === 1) {
            if (rating === 0) {
                return card.learningState
            }
            if (rating === 1) {
                return 1
            }
        }

        if (rating === 0) {
            return card.learningState - 1
        }

        return card.learningState + rating - 1
    }

    public static getLearningStateDueDuration(learningState: number): number {
        const base = 60 * 60 * 1000 // 1h
        const durations = [
            0,
            base / 6,
            base,
            base,
            base * 3,
            base * 12,
            base * 24,
            base * 24 * 3,
            base * 24 * 6,
            base * 24 * 15,
            base * 24 * 30,
        ]

        if (learningState >= durations.length - 1) return durations[durations.length - 1]

        return durations[learningState]
    }

    public static toStudyCards(cards: Card[]): StudyCard[] {
        const studyCards: StudyCard[] = []

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i]
            const cardTypeVariants = CardTypeVariantUtils.getInstance().getAllBy("cardTypeId", card.cardTypeId)
            for (let j = 0; j < cardTypeVariants.length; j++) {
                const cardTypeVariant = cardTypeVariants[j]
                studyCards.push({
                    card,
                    variant: cardTypeVariant
                })
            }
        }

        return studyCards
    }

    public static getCardsByDirectoryId(cardMap: Map<string, Card>, directoryId: string): Card[] {
        const cards: Card[] = []
        const decks = new DirectoryUtils().getSubDecks(directoryId)

        for (const deck of decks) {
            cards.push(...this.getAllBy(cardMap, "deckId", deck.id))
        }
        return cards
    }

    public deleteByDirectoryId(ids: string | string[]): void {
        for (const dirId of Array.isArray(ids) ? ids : [ids]) {
            const subDeck = DirectoryUtils.getInstance().getSubDecks(dirId)
            for (const deck of subDeck) {
                this.deleteBy("deckId", deck.id, {local: true, api: false})
            }
        }
    }

    public countByDirectoryId(directoryId?: string): number {
        if (!directoryId) return 0
        return this.getCardsByDirectoryId(directoryId).length
    }


}


