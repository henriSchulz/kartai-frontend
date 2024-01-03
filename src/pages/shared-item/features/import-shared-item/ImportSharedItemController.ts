import SharedItemController from "../../SharedItemController";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardUtils from "../../../../utils/CardUtils";
import {StaticText} from "../../../../data/text/staticText";
import DeckUtils from "../../../../utils/DeckUtils";
import ImportExportUtils from "../../../../utils/ImportExportUtils";
import SharedItemsUtils from "../../../../utils/SharedItemsUtils";
import {NavigateFunction} from "react-router-dom";
import State from "../../../../types/State";

interface ImportSharedItemControllerOptions extends ModalControllerOptions {
    sharedItemController: SharedItemController
    navigate: NavigateFunction
    states: {
        showState: State<boolean>
        loadingState: State<boolean>
    }
}

export default class ImportSharedItemController extends ModalController<ImportSharedItemControllerOptions> {

    public readonly sharedItemController: SharedItemController;

    public readonly navigate: NavigateFunction;

    constructor(options: ImportSharedItemControllerOptions) {
        super(options);
        this.sharedItemController = options.sharedItemController;
        this.navigate = options.navigate;
    }

    public open = () => {
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = async () => {
        const sharedItem = this.sharedItemController.states.sharedItemState.val!
        const importData = this.sharedItemController.states.importDataState.val!

        const maxCardCount = CardUtils.getInstance().maxClientSize
        if (!CardUtils.getInstance().canAdd(importData.cards.length)) {
            return this.snackbar(StaticText.STORAGE_LIMIT.replaceAll("{items}", maxCardCount.toString()), 4000, "error")
        }

        if (!DeckUtils.getInstance().canAdd(importData.decks.length)) {
            return this.snackbar(StaticText.STORAGE_LIMIT_DECK.replaceAll("{items}", DeckUtils.getInstance().maxClientSize.toString()), 4000, "error")
        }

        this.states.loadingState.set(true)

        await SharedItemsUtils.getInstance().transferSharedItem(sharedItem.id)

        window.location.href = "/deck-overview"
    }

}