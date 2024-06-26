import ImportExportObject from "../types/ImportExportObject";
import DirectoryUtils from "./DirectoryUtils";
import {generateModelId, wait} from "./general";
import Directory from "../types/dbmodel/Directory";
import Deck from "../types/dbmodel/Deck";
import Card from "../types/dbmodel/Card";
import CardType from "../types/dbmodel/CardType";
import FieldContent from "../types/dbmodel/FieldContent";
import Field from "../types/dbmodel/Field";
import CardTypeVariant from "../types/dbmodel/CardTypeVariant";
import DeckUtils from "./DeckUtils";
import CardUtils from "./CardUtils";
import FieldContentUtils from "./FieldContentUtils";
import FieldUtils from "./FieldUtils";
import CardTypeVariantUtils from "./CardTypeVariantUtils";
import CardTypeUtils from "./CardTypeUtils";
import {DeckOrDirectory} from "../types/DeckOrDirectory";
import {isDefaultCardType} from "../data/defaultCardType";
import EntityUtilsFuncOptions from "../types/EntityUtilsFuncOptions";


export default class ImportExportUtils {


    public static async importFromJson(json: string): Promise<boolean> { //If the import is successful, return true. Otherwise, return false
        try {
            const importExportObject = JSON.parse(json) as ImportExportObject
            const {
                decks,
                directories,
                cards,
                cardTypes,
                fields,
                fieldContents,
                cardTypeVariants
            } = importExportObject

            if (!Array.isArray(decks) ||
                !Array.isArray(directories) ||
                !Array.isArray(cards) ||
                !Array.isArray(cardTypes) ||
                !Array.isArray(fields) ||
                !Array.isArray(fieldContents) ||
                !Array.isArray(cardTypeVariants)) return false

            return this.import(importExportObject)
        } catch (e) {
            console.log(e)
            return false
        }
    }

    private static deckImport(oldDeckId: string, newDeckId: string, importExportObject: ImportExportObject): { cards: Card[], fieldContents: FieldContent[] } | false {
        const itemsToImport = {
            cards: [] as Card[],
            fieldContents: [] as FieldContent[]
        }
        for (const card of importExportObject.cards.filter(e => e.deckId === oldDeckId)) {
            if (!CardUtils.getInstance().isValidEntity(card, ["paused"])) return false
            const {id: oldCardId, ...cardToAdd} = card
            const newCardId = generateModelId()
            itemsToImport.cards.push({...cardToAdd, id: newCardId, deckId: newDeckId, paused: 0})
            for (const fieldContent of importExportObject.fieldContents.filter(e => e.cardId === oldCardId)) {
                if (!FieldContentUtils.getInstance().isValidEntity(fieldContent)) return false
                const {id: oldFieldContentId, ...fieldContentToAdd} = fieldContent
                const newFieldContentId = generateModelId()
                itemsToImport.fieldContents.push({
                    ...fieldContentToAdd,
                    id: newFieldContentId,
                    cardId: newCardId
                })
            }
        }
        return itemsToImport
    }

    public static async import(importExportObject: ImportExportObject, options: EntityUtilsFuncOptions = {
        local: true,
        api: true
    }): Promise<boolean> {
        try {
            const itemsToImport = {
                directories: [] as Directory[],
                decks: [] as Deck[],
                cards: [] as Card[],
                cardTypes: [] as CardType[],
                fieldContents: [] as FieldContent[],
                fields: [] as Field[],
                cardTypeVariants: [] as CardTypeVariant[],
            }

            for (const directory of importExportObject.directories) {

                if (!DirectoryUtils.getInstance().isValidEntity(directory)) return false
                const {id: oldDirectoryId, ...directoryToAdd} = directory
                const newDirectoryId = generateModelId()
                itemsToImport.directories.push({...directoryToAdd, id: newDirectoryId})
                for (const deck of importExportObject.decks.filter(e => e.parentId === oldDirectoryId)) {
                    if (!DeckUtils.getInstance().isValidEntity(deck, ["isShared"])) return false
                    const {id: oldDeckId, ...deckToAdd} = deck
                    const newDeckId = generateModelId()
                    itemsToImport.decks.push({...deckToAdd, id: newDeckId, parentId: newDirectoryId, isShared: 0})
                    const res = this.deckImport(oldDeckId, newDeckId, importExportObject)
                    if (!res) return false
                    const {cards, fieldContents} = res
                    itemsToImport.cards.push(...cards)
                    itemsToImport.fieldContents.push(...fieldContents)
                }
            }
            if (importExportObject.directories.length === 0) {
                for (const deck of importExportObject.decks) {
                    if (!DeckUtils.getInstance().isValidEntity(deck, ["isShared"])) return false
                    const {id: oldDeckId, ...deckToAdd} = deck
                    const newDeckId = generateModelId()
                    itemsToImport.decks.push({...deckToAdd, id: newDeckId, isShared: 0, parentId: null})
                    const res = this.deckImport(oldDeckId, newDeckId, importExportObject)
                    if (!res) return false
                    const {cards, fieldContents} = res
                    itemsToImport.cards.push(...cards)
                    itemsToImport.fieldContents.push(...fieldContents)
                }
            }

            const tmpExportCards = []
            const tmpExportFieldContents = []

            for (const cardType of importExportObject.cardTypes) {
                if (!CardTypeUtils.getInstance().isValidEntity(cardType)) return false
                if (isDefaultCardType(cardType)) continue
                const {id: oldCardTypeId} = cardType
                const newCardTypeId = generateModelId()

                const updatedCardType = {...cardType, id: newCardTypeId};

                itemsToImport.cardTypes.push(updatedCardType);


                for (const card of itemsToImport.cards.filter(e => e.cardTypeId === oldCardTypeId)) {

                    tmpExportCards.push({
                        ...card, cardTypeId: newCardTypeId
                    })
                }

                for (const field of importExportObject.fields.filter(e => e.cardTypeId === oldCardTypeId)) {
                    if (!FieldUtils.getInstance().isValidEntity(field)) return false
                    const {id: oldFieldId, ...fieldToAdd} = field
                    const newFieldId = generateModelId()
                    itemsToImport.fields.push({...fieldToAdd, id: newFieldId, cardTypeId: newCardTypeId})
                    for (const fieldContent of itemsToImport.fieldContents.filter(e => e.fieldId === oldFieldId)) {
                        tmpExportFieldContents.push({
                            ...fieldContent, fieldId: newFieldId
                        })
                    }
                }
                for (const cardTypeVariant of importExportObject.cardTypeVariants.filter(e => e.cardTypeId === oldCardTypeId)) {
                    if (!CardTypeVariantUtils.getInstance().isValidEntity(cardTypeVariant)) return false
                    const {id: oldCardTypeVariantId, ...cardTypeVariantToAdd} = cardTypeVariant
                    const newCardTypeVariantId = generateModelId()
                    itemsToImport.cardTypeVariants.push({
                        ...cardTypeVariantToAdd,
                        id: newCardTypeVariantId,
                        cardTypeId: newCardTypeId
                    })
                }
            }

            itemsToImport.cards = tmpExportCards
            itemsToImport.fieldContents = tmpExportFieldContents


            await DirectoryUtils.getInstance().add(itemsToImport.directories, options)
            await DeckUtils.getInstance().add(itemsToImport.decks, options)
            await CardTypeUtils.getInstance().addCardTypesAndVariantsAndFields(itemsToImport.cardTypes, itemsToImport.cardTypeVariants, itemsToImport.fields, options)
            await CardUtils.getInstance().addCardsAndFieldContents(itemsToImport.cards, itemsToImport.fieldContents, options)
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    public static export(deckOrDirectory: DeckOrDirectory): ImportExportObject {
        const itemsToExport: ImportExportObject = {
            directories: [] as Directory[],
            decks: [] as Deck[],
            cards: [] as Card[],
            cardTypes: [] as CardType[],
            fieldContents: [] as FieldContent[],
            fields: [] as Field[],
            cardTypeVariants: [] as CardTypeVariant[],
        }

        if (deckOrDirectory.isDirectory) {
            itemsToExport.directories = [...DirectoryUtils.getInstance().getSubDirectories(deckOrDirectory.id), deckOrDirectory as Directory]
            const decks = DirectoryUtils.getInstance().getSubDecks(deckOrDirectory.id)
            itemsToExport.decks.push(...decks)
            for (const deck of decks) {
                const cards = CardUtils.getInstance().getCardsByDeckId(deck.id)
                itemsToExport.cards.push(...cards)
                for (const card of cards) {
                    const fieldContents = FieldContentUtils.getInstance().getAllBy("cardId", card.id)
                    itemsToExport.fieldContents.push(...fieldContents)

                    if (!itemsToExport.cardTypes.some(e => e.id === card.cardTypeId)) {
                        const cardType = CardTypeUtils.getInstance().getById(card.cardTypeId)
                        if (cardType) {
                            itemsToExport.cardTypes.push(cardType)
                            itemsToExport.fields.push(...FieldUtils.getInstance().getAllBy("cardTypeId", cardType.id))
                            itemsToExport.cardTypeVariants.push(...CardTypeVariantUtils.getInstance().getAllBy("cardTypeId", cardType.id))
                        }
                    }
                }
            }
            return itemsToExport
        } else {

            const deck = DeckUtils.getInstance().getById(deckOrDirectory.id)
            if (!deck) return itemsToExport
            itemsToExport.decks.push(deck)
            const cards = CardUtils.getInstance().getCardsByDeckId(deck.id)
            itemsToExport.cards.push(...cards)
            for (const card of cards) {
                const fieldContents = FieldContentUtils.getInstance().getAllBy("cardId", card.id)
                itemsToExport.fieldContents.push(...fieldContents)

                if (!itemsToExport.cardTypes.some(e => e.id === card.cardTypeId)) {
                    const cardType = CardTypeUtils.getInstance().getById(card.cardTypeId)
                    if (cardType) {
                        itemsToExport.cardTypes.push(cardType)
                        itemsToExport.fields.push(...FieldUtils.getInstance().getAllBy("cardTypeId", cardType.id))
                        itemsToExport.cardTypeVariants.push(...CardTypeVariantUtils.getInstance().getAllBy("cardTypeId", cardType.id))
                    }
                }
            }
            return itemsToExport
        }
    }

    public static exportJSON(deckOrDirectory: DeckOrDirectory): string {
        return JSON.stringify(this.export(deckOrDirectory))
    }

    public static exportAll(): ImportExportObject {
        return {
            directories: DirectoryUtils.getInstance().toArray(),
            decks: DeckUtils.getInstance().toArray(),
            cards: CardUtils.getInstance().toArray(),
            cardTypes: CardTypeUtils.getInstance().toArray(),
            fieldContents: FieldContentUtils.getInstance().toArray(),
            fields: FieldUtils.getInstance().toArray(),
            cardTypeVariants: CardTypeVariantUtils.getInstance().toArray(),
        }
    }

    // let csv = cards.map(c => {
    //     const fieldTuples = fieldContentStore.loadFieldTuples(
    //         c,
    //         fieldStore.getFieldsByCardTypeId(c.cardTypeId)
    //     )
    //     return `${fieldTuples.map(f => f[FIELD_CONTENT_INDEX].content).join("\t")}`
    // }).join("\n")

    public static exportCSV(deckOrDirectory: DeckOrDirectory, csvDelimiter: string = "\t") {
        const cards: Card[] = []

        if (deckOrDirectory.isDirectory) {
            for (const deck of DirectoryUtils.getInstance().getSubDecks(deckOrDirectory.id)) {
                cards.push(...CardUtils.getInstance().getCardsByDeckId(deck.id))
            }
        } else {
            cards.push(...CardUtils.getInstance().getCardsByDeckId(deckOrDirectory.id))
        }

        return cards.map(c => {
            return FieldContentUtils.getInstance().getAllBy("cardId", c.id).map(f => f.content.replaceAll("\n", "")).join(csvDelimiter)
        }).join("\n")

    }
}