import SharedItemsUtils from "../../utils/SharedItemsUtils";
import {NavigateFunction} from "react-router-dom";
import State from "../../types/State";
import LoadingBackdropFunction from "../../types/LoadingBackdropFunction";
import ImportExportObject from "../../types/ImportExportObject";
import FieldContentPair from "../../types/FieldContentPair";
import {getRandomElements, wait} from "../../utils/general";
import Card from "../../types/dbmodel/Card";
import store from "../../stores/store";
import ApiService from "../../services/ApiService";
import SharedItem from "../../types/dbmodel/SharedItem";
import {sharedItemsSlice} from "../../stores/slices";

interface SharedItemControllerControllerOptions {
    id?: string
    navigate: NavigateFunction
    loadingBackdrop: LoadingBackdropFunction
    states: {
        loadingState: State<boolean>
        initDoneState: State<boolean>
        importDataState: State<ImportExportObject | null>
        sampleFieldContentPairsArrayState: State<FieldContentPair[][]>
        sharedItemState: State<SharedItem | null>
    }
}


export default class SharedItemController {

    private readonly id?: string

    private readonly navigate: NavigateFunction

    private readonly loadingBackdrop: LoadingBackdropFunction

    public readonly states: SharedItemControllerControllerOptions["states"]

    constructor(options: SharedItemControllerControllerOptions) {
        this.id = options.id
        this.navigate = options.navigate
        this.loadingBackdrop = options.loadingBackdrop
        this.states = options.states
    }


    public init = async () => {
        if (!store.getState().sharedItems.isInitialized) {
            const sharedItems = await new ApiService<SharedItem>("sharedItems").loadAll()
            store.dispatch(sharedItemsSlice.actions.init(sharedItems))
        }

        await wait(100)

        if (!this.id) return this.navigate("/public-decks")
        if (!SharedItemsUtils.getInstance().has(this.id)) return this.navigate("/public-decks")

        this.states.sharedItemState.set(SharedItemsUtils.getInstance().getById(this.id))

        this.loadingBackdrop(true)

        try {
            const importExportObject = await SharedItemsUtils.getInstance().getSharedItemDownload(this.id)
            const cardsLength = importExportObject.cards.length

            const sampleCards = cardsLength < 6 ? importExportObject.cards : getRandomElements<Card>(importExportObject.cards, 6)

            for (const sampleCard of sampleCards) {
                const fields = [...importExportObject.fields]

                const fieldContentPairs: FieldContentPair[] = []
                for (const field of fields) {
                    for (const fieldContent of importExportObject.fieldContents) {
                        if (field.id === fieldContent.fieldId) {
                            if (fieldContent.cardId === sampleCard.id) {
                                fieldContentPairs.push({
                                    field, fieldContent
                                })
                            }
                        }
                    }
                }
                this.states.sampleFieldContentPairsArrayState.set(prev => [...prev, fieldContentPairs])
            }

            this.states.importDataState.set(importExportObject)

            this.loadingBackdrop(false)
        } catch (e) {
            console.log(e)
            this.loadingBackdrop(false)
            this.navigate("/public-decks")
        }


    }

}

