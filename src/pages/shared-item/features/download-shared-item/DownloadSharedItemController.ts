import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import State from "../../../../types/State";
import SharedItemController from "../../SharedItemController";
import SharedItem from "../../../../types/dbmodel/SharedItem";
import {createDownload} from "../../../../utils/general";
import FieldContentUtils from "../../../../utils/FieldContentUtils";

interface DownloadSharedItemControllerOptions extends ModalControllerOptions {
    sharedItemController: SharedItemController
    states: {
        showState: State<boolean>
        selectedExportFormatState: State<"csv" | "kpkg">
        csvDelimiterState: State<string>
        loadingState: State<boolean>
    }
}


export default class DownloadSharedItemController extends ModalController<DownloadSharedItemControllerOptions> {

    private readonly sharedItemController: SharedItemController;

    constructor(options: DownloadSharedItemControllerOptions) {
        super(options);
        this.sharedItemController = options.sharedItemController;
    }


    public open = () => {
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        const sharedItem: SharedItem = this.sharedItemController.states.sharedItemState.val!
        const importData = this.sharedItemController.states.importDataState.val!


        this.states.loadingState.set(true)
        if (this.states.selectedExportFormatState.val === "kpkg") {
            const json = JSON.stringify(importData)
            createDownload(sharedItem.sharedItemName + ".kpkg", json)
        } else {
            const csv = importData.cards.map(c => {
                return importData.fieldContents.filter(fc => fc.cardId === c.id).map(f => f.content).join(this.states.csvDelimiterState.val)
            }).join("\n")
            createDownload(sharedItem.sharedItemName + ".csv", csv)
        }
        this.states.loadingState.set(false)
        this.close()


    }

}