import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import SharedItemsController from "../../SharedItemsController";
import SharedItem from "../../../../types/dbmodel/SharedItem";
import SharedItemsUtils from "../../../../utils/SharedItemsUtils";
import DeckUtils from "../../../../utils/DeckUtils";
import DirectoryUtils from "../../../../utils/DirectoryUtils";
import {StaticText} from "../../../../data/text/staticText";

interface UnshareItemControllerOptions extends ModalControllerOptions {
    sharedItemsController: SharedItemsController
}


export default class UnshareItemController extends ModalController<UnshareItemControllerOptions> {
    public sharedItemsController: SharedItemsController

    constructor(options: UnshareItemControllerOptions) {
        super(options);
        this.sharedItemsController = options.sharedItemsController
    }


    public open = (sharedItem?: SharedItem) => {
        this.sharedItemsController.selectedTempSharedItem(sharedItem!)
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        const item = this.sharedItemsController.getTempSelectedSharedItem()
        SharedItemsUtils.getInstance().delete(item.id)

        if (DeckUtils.getInstance().has(item.sharedItemId)) {
            DeckUtils.getInstance().updateById(item.sharedItemId, {isShared: 0})
        } else {
            DirectoryUtils.getInstance().updateById(item.sharedItemId, {isShared: 0})
        }
        this.snackbar(StaticText.ELEMENT_UNSHARED, 4000)
        this.close()
    }
}