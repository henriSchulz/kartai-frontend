import {SnackbarFunction} from "../../../../types/snackbar";
import State from "../../../../types/State";
import {DeckOrDirectory} from "../../../../types/DeckOrDirectory";
import DeckOverviewController from "../../DeckOverviewController";
import ImportExportUtils from "../../../../utils/ImportExportUtils";
import {createDownload} from "../../../../utils/general";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";

interface ExportDeckOrDirectoryControllerOptions extends ModalControllerOptions {
    states: {
        showState: State<boolean>
        selectedExportFormatState: State<"csv" | "kpkg">
        csvDelimiterState: State<string>
    }
    deckOverviewController: DeckOverviewController
    snackbar: SnackbarFunction
}


export default class ExportDeckOrDirectoryController extends ModalController<ExportDeckOrDirectoryControllerOptions> {


    public deckOverviewController: DeckOverviewController


    constructor(options: ExportDeckOrDirectoryControllerOptions) {
        super(options)
        this.deckOverviewController = options.deckOverviewController
    }

    open = (deckOrDirectory?: DeckOrDirectory) => {
        this.deckOverviewController.selectTempDeckOrDirectory(deckOrDirectory!)
        this.states.showState.set(true)
    }

    close = () => {
        this.states.showState.set(false)
    }

    submit = () => {
        const deckOrDirectory = this.deckOverviewController.getSelectedTempDeckOrDirectory()

        this.deckOverviewController.toggleLoading()
        if (this.states.selectedExportFormatState.val === "kpkg") {
            const json = ImportExportUtils.exportJSON(deckOrDirectory)
            createDownload(deckOrDirectory.name + ".kpkg", json)
        } else if (this.states.selectedExportFormatState.val === "csv") {
            const csv = ImportExportUtils.exportCSV(deckOrDirectory, this.states.csvDelimiterState.val)
            createDownload(deckOrDirectory.name + ".csv", csv)
        }
        this.deckOverviewController.toggleLoading()

        this.close()
    }


}