import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import State from "../../../../types/State";
import DeckOverviewController from "../../DeckOverviewController";
import {CSVParser} from "../../../../utils/CSVParser";
import {StaticText} from "../../../../data/text/staticText";
import CardUtils from "../../../../utils/CardUtils";
import {LocalStorageKeys} from "../../../../data/LocalStorageKeys";
import DeckUtils from "../../../../utils/DeckUtils";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import Field from "../../../../types/dbmodel/Field";
import FieldUtils from "../../../../utils/FieldUtils";
import NewDeckOrDirectoryController from "../new-deck-or-directory/NewDeckOrDirectoryController";
import Card from "../../../../types/dbmodel/Card";
import FieldContent from "../../../../types/dbmodel/FieldContent";
import {generateModelId} from "../../../../utils/general";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import {Limits} from "../../../../Settings";
import LoadingBackdropFunction from "../../../../types/LoadingBackdropFunction";

interface ImportCSVControllerOptions extends ModalControllerOptions {
    states: {
        showState: State<boolean>
        selectedDestinationDeckIdState: State<string>
        selectedCardTypeIdState: State<string>
        activeCsvImportStepState: State<number>
        fieldsChoiceState: State<Record<number, string>>
        csvFileTextState: State<string>
        parsedCsvState: State<string[][]>
        csvDelimiterState: State<string>
        loadingState: State<boolean>
        uploadDurationState: State<number>
    },
    deckOverviewController: DeckOverviewController
    newDeckOrDirectoryController: NewDeckOrDirectoryController
    loadingBackdrop: LoadingBackdropFunction
}


export default class ImportCSVController extends ModalController<ImportCSVControllerOptions> {

    public deckOverviewController: DeckOverviewController
    public newDeckOrDirectoryController: NewDeckOrDirectoryController
    public loadingBackdrop: LoadingBackdropFunction

    constructor(options: ImportCSVControllerOptions) {
        super(options);
        this.deckOverviewController = options.deckOverviewController
        this.newDeckOrDirectoryController = options.newDeckOrDirectoryController
        this.loadingBackdrop = options.loadingBackdrop
    }

    public onSelectCsvFile = async (files: File[]) => {
        if (files.length === 0) {
            return
        }

        const file = files[0]

        if (file.size > 4 * 1024 * 1024) {
            return this.snackbar(StaticText.FILE_TOO_BIG.replaceAll("{name}", file.name)
                    .replaceAll("{size}", "4")
                , 4000, "error")
        }

        const text = await file.text()
        this.resetStates()
        this.states.csvFileTextState.set(text)
        const delimiter = new CSVParser(text).predictDelimiter()
        this.states.csvDelimiterState.set(delimiter)
        this.open()
    }

    public resetStates = () => {
        this.states.activeCsvImportStepState.set(0)
        this.states.parsedCsvState.set([])
        this.states.csvFileTextState.set("")
        this.states.csvDelimiterState.set("\t")
        this.states.fieldsChoiceState.set({})
        this.states.selectedCardTypeIdState.set("")
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


    public open = () => {
        this.states.showState.set(true)
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

    public submit = async () => {

        const cardsToAdd: Card[] = []
        const fieldContentsToAdd: FieldContent[] = []

        const entries = Object.entries(this.states.fieldsChoiceState.val)

        if (!this.states.selectedDestinationDeckIdState.val) {
            return this.snackbar(StaticText.PLEASE_SELECT_DECK, 4000, "error")
        }

        const selectedDeck = DeckUtils.getInstance().getById(this.states.selectedDestinationDeckIdState.val)

        const deckCardsCount = CardUtils.getInstance().getCardsByDeckId(selectedDeck.id).length

        if (deckCardsCount + this.states.parsedCsvState.val.length > Limits.DECK_SIZE_LIMIT) {
            return this.snackbar(StaticText.STORAGE_LIMIT_DECK.replaceAll("{items}", Limits.DECK_SIZE_LIMIT.toString()), 4000, "error")
        }

        if (entries.length !== this.states.parsedCsvState.val[0].length) {
            return this.snackbar(StaticText.ALL_FIELDS_MUST_BE_ASSIGNED, 6000, "error")
        }

        if (this.hasDuplicateValues(this.states.fieldsChoiceState.val)) {
            return this.snackbar(StaticText.EACH_FIELD_CAN_ONLY_BE_ASSIGNED_TO_ONE_OTHER_FIELD, 6000, "error")
        }

        const emptyCount = Object.values(this.states.fieldsChoiceState.val).filter(e => e === "EMPTY").length

        const selectedFields = FieldUtils.getInstance().getAllBy("cardTypeId", this.states.selectedCardTypeIdState.val)
        const allowedEmptyCount = this.states.parsedCsvState.val[0].length - selectedFields!.length

        if (emptyCount !== 0 && emptyCount > allowedEmptyCount) {
            return this.snackbar(StaticText.ALLOW_MINIMUM_EMPTY_FIELDS, 6000, "error")
        }

        let validRow;
        for (const row of this.states.parsedCsvState.val) {
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


                    const content = row[Number(csvFieldIndex)]

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

    public onParseCsv = () => {
        const csvParser = new CSVParser(this.states.csvFileTextState.val)
        const parseResult = csvParser.parse(this.states.csvDelimiterState.val)

        if (!parseResult) {
            return this.snackbar(StaticText.COULD_NOT_PARSE_CSV, 4000, "error")
        }

        const csvRows = parseResult.addedRows



        if (csvRows === 0) {
            this.close()
            return this.snackbar(StaticText.COULD_NOT_PARSE_CSV, 4000, "error")
        }


        if (csvRows > Limits.IMPORT_LIMIT) {
            this.close()
            return this.snackbar(StaticText.IMPORT_LIMIT.replaceAll("{items}", Limits.IMPORT_LIMIT.toString()), 4000, "error")
        }

        const maxCardCount = CardUtils.getInstance().maxClientSize

        if (!CardUtils.getInstance().canAdd(csvRows)) {
            this.close()
            return this.snackbar(StaticText.STORAGE_LIMIT.replaceAll("{items}", maxCardCount.toString()), 4000, "error")
        }


        this.snackbar(StaticText.CSV_SUCCESSFULLY_PARSED.replaceAll("{items}", parseResult.addedRows.toString()), 2000, "success")
        this.states.parsedCsvState.set(parseResult.table)
        this.setDefaultSelectedDeck()
        const cardTypeId = this.setDefaultSelectedCardType()
        if (cardTypeId) {
            this.setDefaultFieldsChoice(parseResult.table, FieldUtils.getInstance().getAllBy("cardTypeId", cardTypeId))
        }
        this.states.activeCsvImportStepState.set(prev => prev + 1)
    }

    public setDefaultFieldsChoice = (table: string[][], fields: Field[]) => {
        const fc: Record<number, string> = {}
        const rowValueCount = table[0].length
        for (let i = 0; i < rowValueCount; i++) {
            const field = fields[i]
            const id = field ? field.id : "EMPTY"
            fc[i] = id
        }
        this.states.fieldsChoiceState.set(fc)
    }

    public close = () => {
        this.states.showState.set(false)
    }


}