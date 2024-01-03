import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import State from "../../../../types/State";
import CardsController from "../../CardsController";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import {LocalStorageKeys} from "../../../../data/LocalStorageKeys";
import {StaticText} from "../../../../data/text/staticText";
import OpenaiApiService from "../../../../services/OpenaiApiService";
import FileUtils from "../../../../utils/FileUtils";
import Card from "../../../../types/dbmodel/Card";
import FieldContent from "../../../../types/dbmodel/FieldContent";
import CardUtils from "../../../../utils/CardUtils";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import React from "react";
import {Settings} from "../../../../Settings";

interface GenerateCardsControllerOptions extends ModalControllerOptions {
    cardsController: CardsController
    states: {
        showState: State<boolean>
        loadingState: State<boolean>
        selectedCardTypeIdState: State<string>
        activeGenerateCardsStepState: State<number>
        cardGenerationInputTextState: State<string>
        uploadedFileState: State<File | null>
        generatedCardsState: State<Card[]>
        generatedFieldContentsState: State<FieldContent[]>

    }
}

export default class GenerateCardsController extends ModalController<GenerateCardsControllerOptions> {

    public cardsController: CardsController

    constructor(options: GenerateCardsControllerOptions) {
        super(options)
        this.cardsController = options.cardsController
    }

    open = () => {
        if (!Settings.OPENAI_KEY || Settings.OPENAI_KEY === "") return this.snackbar(StaticText.PLEASE_SET_OPENAI_KEY, 6000, "error")

        this.setDefaultSelectedCardType()
        this.states.activeGenerateCardsStepState.set(0)
        this.states.cardGenerationInputTextState.set("")
        this.states.uploadedFileState.set(null)
        this.states.generatedCardsState.set([])
        this.states.generatedFieldContentsState.set([])
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }


    setDefaultSelectedCardType = () => {
        const lastSelectedID = localStorage.getItem(LocalStorageKeys.LAST_SELECTED_CARD_TYPE) ?? ""
        if (CardTypeUtils.getInstance().has(lastSelectedID!)) {
            this.states.selectedCardTypeIdState.set(lastSelectedID)
        } else {
            const firstCardType = CardTypeUtils.getInstance().toArray()[0]
            if (firstCardType) {
                this.states.selectedCardTypeIdState.set(firstCardType.id)
            }
        }
    }


    submit = async () => {
        this.states.loadingState.set(true)
        await CardUtils.getInstance().addCardsAndFieldContents(this.states.generatedCardsState.val, this.states.generatedFieldContentsState.val)
        this.states.loadingState.set(false)
        this.close()
        this.snackbar(StaticText.CARDS_ADDED.replaceAll("{cards}", this.states.generatedCardsState.val.length.toString())
            , 4000)
    }

    onOpenFileSelector = () => {
        const element = document.getElementById("generate-cards-file-selector")
        if (element) {
            element.click()
        }
    }


    getFileType = (file: File): "img" | "pdf" | "text" => {
        let fileType: "img" | "pdf" | "text" = "text"

        if (file.type.startsWith("image")) fileType = "img"
        if (file.type.startsWith("text")) fileType = "text"
        if (file.type.includes("pdf")) fileType = "pdf"
        return fileType
    }

    onUploadFile = (files: File[]) => {
        const file = files[0]
        if (file.size > 10 * 1024 * 1024) {
            return this.snackbar(StaticText.FILE_TOO_BIG
                    .replaceAll("{name}", file.name)
                    .replaceAll("{size}", "10")
                , 4000, "error")
        }
        this.states.uploadedFileState.set(file)
    }

    onGenerateCards = async (file: File, fileType: "img" | "pdf" | "text") => {
        this.states.loadingState.set(true)

        let text = null

        switch (fileType) {
            case "img":
                text = await FileUtils.imageToText(file)
                break
            case "pdf":
                text = await FileUtils.pdfToText(file)
                break
            case "text":
                text = await file.text()
                break
        }

        if (text === null) throw new Error("Unsupported file type")

        if (text.length < 100) {
            this.states.loadingState.set(false)
            return this.snackbar(StaticText.NOT_ENOUGH_INPUT_TEXT, 6000, "error")
        }


        const result = await OpenaiApiService.generateCards(CardTypeUtils.getInstance().toArray()[0].id, this.cardsController.deckId!, text)

        if (!result) {
            this.states.loadingState.set(false)
            return this.snackbar(StaticText.FAILED_TO_GENERATE_CARDS, 6000, "error")
        }

        const {cards, fieldContents} = result


        this.states.generatedCardsState.set(cards)
        this.states.generatedFieldContentsState.set(fieldContents)
        this.states.activeGenerateCardsStepState.set(1)
        this.states.loadingState.set(false)
        console.log(cards, fieldContents)
    }

    onContinue = async () => {
        if (!this.states.uploadedFileState.val) return this.snackbar(StaticText.NO_FILE_UPLOADED, 4000, "error")

        const fileType = this.getFileType(this.states.uploadedFileState.val)

        await this.onGenerateCards(this.states.uploadedFileState.val, fileType)
    }

    removeCard = (card: Card) => {
        const cards = [...this.states.generatedCardsState.val]
        const fieldContents = [...this.states.generatedFieldContentsState.val]

        const cardIndex = cards.findIndex(c => c.id === card.id)

        if (cardIndex === -1) return

        cards.splice(cardIndex, 1)

        const fieldContentIndexes = fieldContents
            .map((fc, index) => ({fc, index}))
            .filter(({fc}) => fc.cardId === card.id)
            .map(({index}) => index)

        fieldContentIndexes.forEach(index => fieldContents.splice(index, 1))

        this.states.generatedCardsState.set(cards)
        this.states.generatedFieldContentsState.set(fieldContents)
    }

    onPasteFile = (event: ClipboardEvent) => {
        if (!event.clipboardData) return console.log("No clipboard data")
        const item = Array.from(event.clipboardData.items).find(x => /^image\//.test(x.type));
        if (!item) return console.log("No image in clipboard")
        const file = item.getAsFile()
        this.states.uploadedFileState.set(file)
    }


}


