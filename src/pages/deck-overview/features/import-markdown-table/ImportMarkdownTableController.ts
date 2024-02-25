import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import State from "../../../../types/State";
import DeckOverviewController from "../../DeckOverviewController";
import {LocalStorageKeys} from "../../../../data/LocalStorageKeys";
import DeckUtils from "../../../../utils/DeckUtils";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import {generateModelId, getCheckBoxValue, getTextFieldValue, markdownToCsv} from "../../../../utils/general";
import {StaticText} from "../../../../data/text/staticText";
import CraftImportService from "../../../../services/CraftImportService";
import NewDeckOrDirectoryController from "../new-deck-or-directory/NewDeckOrDirectoryController";
import FieldUtils from "../../../../utils/FieldUtils";
import {Limits} from "../../../../Settings";
import Card from "../../../../types/dbmodel/Card";
import FieldContent from "../../../../types/dbmodel/FieldContent";
import CardUtils from "../../../../utils/CardUtils";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import LoadingBackdropFunction from "../../../../types/LoadingBackdropFunction";

interface ImportCraftTableControllerOptions extends ModalControllerOptions {
    deckOverviewController: DeckOverviewController
    newDeckOrDirectoryController: NewDeckOrDirectoryController
    loadingBackdrop: LoadingBackdropFunction
    states: {
        showState: State<boolean>
        selectedDestinationDeckIdState: State<string>
        selectedCardTypeIdState: State<string>
        activeCsvImportStepState: State<number>
        fieldsChoiceState: State<Record<number, string>>
        parsedCraftTableState: State<string[][]>
        loadingState: State<boolean>
    }
}


export default class ImportMarkdownTableController extends ModalController<ImportCraftTableControllerOptions> {

    public deckOverviewController: DeckOverviewController

    public newDeckOrDirectoryController: NewDeckOrDirectoryController

    public loadingBackdrop: LoadingBackdropFunction

    constructor(options: ImportCraftTableControllerOptions) {
        super(options);
        this.deckOverviewController = options.deckOverviewController
        this.newDeckOrDirectoryController = options.newDeckOrDirectoryController
        this.loadingBackdrop = options.loadingBackdrop
    }

    public open = () => {
        this.states.fieldsChoiceState.set({})
        this.states.parsedCraftTableState.set([])
        this.states.activeCsvImportStepState.set(0)
        this.states.showState.set(true)
    }

    public setDefaultSelectedDeck = () => {
        let deckId = localStorage.getItem(LocalStorageKeys.LAST_SELECTED_DECK)
        if (deckId && DeckUtils.getInstance().has(deckId)) {
            this.states.selectedDestinationDeckIdState.set(deckId)
        } else {
            const deck = DeckUtils.getInstance().toArray()[0]
            if (deck) this.states.selectedDestinationDeckIdState.set(deck.id)
        }
    }

    //return the cardType id if there's a default cardType, else return null

    public setDefaultSelectedCardType = (): string | null => {
        let cardTypeId = localStorage.getItem(LocalStorageKeys.LAST_SELECTED_CARD_TYPE)
        if (cardTypeId && CardTypeUtils.getInstance().has(cardTypeId)) {
            this.states.selectedCardTypeIdState.set(cardTypeId)
            return cardTypeId
        } else {
            const cardType = CardTypeUtils.getInstance().toArray()[0]
            if (cardType) {
                this.states.selectedCardTypeIdState.set(cardType.id)
                return cardType.id
            }
        }
        return null
    }

    private hasDuplicateValues = (inputObject: object) => {
        const seenValues = new Set();

        const values = Object.values(inputObject);

        for (const value of values) {
            if (value !== 'EMPTY') {
                if (seenValues.has(value)) {
                    return true;
                } else {
                    seenValues.add(value);
                }
            }
        }
        return false;
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = async () => {

        const cardsToAdd: Card[] = []
        const fieldContentsToAdd: FieldContent[] = [] as FieldContent[]

        const entries = Object.entries(this.states.fieldsChoiceState.val)

        if (!this.states.selectedDestinationDeckIdState.val) {
            return this.snackbar(StaticText.PLEASE_SELECT_DECK, 4000, "error")
        }

        const selectedDeck = DeckUtils.getInstance().getById(this.states.selectedDestinationDeckIdState.val)

        const deckCardsCount = CardUtils.getInstance().getCardsByDeckId(selectedDeck.id).length

        if (deckCardsCount + this.states.parsedCraftTableState.val.length > Limits.DECK_SIZE_LIMIT) {
            return this.snackbar(StaticText.STORAGE_LIMIT_DECK.replaceAll("{items}", Limits.DECK_SIZE_LIMIT.toString()), 4000, "error")
        }


        if (entries.length !== this.states.parsedCraftTableState.val[0].length) {
            return this.snackbar(StaticText.ALL_FIELDS_MUST_BE_ASSIGNED, 6000, "error")
        }

        if (this.hasDuplicateValues(this.states.fieldsChoiceState.val)) {
            return this.snackbar(StaticText.EACH_FIELD_CAN_ONLY_BE_ASSIGNED_TO_ONE_OTHER_FIELD, 6000, "error")
        }

        const emptyCount = Object.values(this.states.fieldsChoiceState.val).filter(e => e === "EMPTY").length

        const selectedFields = FieldUtils.getInstance().getAllBy("cardTypeId", this.states.selectedCardTypeIdState.val)
        const allowedEmptyCount = this.states.parsedCraftTableState.val[0].length - selectedFields!.length

        if (emptyCount !== 0 && emptyCount > allowedEmptyCount) {
            return this.snackbar(StaticText.ALLOW_MINIMUM_EMPTY_FIELDS, 6000, "error")
        }

        let validRow;
        for (const row of this.states.parsedCraftTableState.val) {
            validRow = true
            const cardId = generateModelId()
            for (const [csvFieldIndex, chosenFieldId] of entries) {
                if (chosenFieldId !== "EMPTY") {

                    if (!row[Number(csvFieldIndex)]) {
                        validRow = false
                        break
                    }

                    if (row[Number(csvFieldIndex)].length > FieldContentUtils.getInstance().storeSchema.content.limit) {
                        validRow = false
                        break
                    }


                    const content = row[Number(csvFieldIndex)].replaceAll("\n", "")

                    fieldContentsToAdd.push({
                        id: generateModelId(),
                        fieldId: chosenFieldId,
                        cardId: cardId,
                        content
                    })
                }
            }

            if (validRow) {
                cardsToAdd.push({
                    learningState: 0,
                    dueAt: Date.now(),
                    id: cardId,
                    cardTypeId: this.states.selectedCardTypeIdState.val,
                    deckId: selectedDeck.id,
                    paused: 0,
                })
            }


        }
        this.close()
        this.loadingBackdrop(true)
        await CardUtils.getInstance().addCardsAndFieldContents(cardsToAdd, fieldContentsToAdd)
        this.loadingBackdrop(false)
        this.snackbar(StaticText.CARDS_IMPORTED.replaceAll("{items}", cardsToAdd.length.toString()), 4000, "success")
    }


    public onParseMarkdownTable = async () => {
        const markdownText = getTextFieldValue("markdown-text")!


        if (markdownText.length === 0 || markdownText.replaceAll(" ", "").length === 0) {
            return this.snackbar(StaticText.FIELD_EMPTY, 6000, "error")
        }


        this.states.loadingState.set(true)

        const hasHeader = getCheckBoxValue("table-head")

        try {
            const table = markdownToCsv(markdownText, {hasHeader})


            if (!table || table.length === 0) {
                this.states.loadingState.set(false)
                return this.snackbar(StaticText.MARKDOWN_IMPORT_FAILED, 6000, "error")
            }

            this.snackbar(StaticText.CSV_SUCCESSFULLY_PARSED.replaceAll("{items}", table.length.toString()), 2000, "success")

            this.states.parsedCraftTableState.set(table)

            this.setDefaultSelectedCardType()
            this.setDefaultSelectedDeck()
            this.states.loadingState.set(false)
            this.states.activeCsvImportStepState.set(1)
        } catch (e) {
            this.states.loadingState.set(false)
            this.snackbar(StaticText.MARKDOWN_IMPORT_FAILED, 6000, "error")
        }
    }

}