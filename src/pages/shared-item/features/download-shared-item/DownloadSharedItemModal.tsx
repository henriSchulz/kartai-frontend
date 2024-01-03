import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import KartAISelect from "../../../../components/ui/KartAISelect";
import DownloadSharedItemController from "./DownloadSharedItemController";


interface DownloadSharedItemModalProps {
    controller: DownloadSharedItemController
}


export default function ({controller}: DownloadSharedItemModalProps) {

    const exportFormatOptions = [
        {value: "kpkg", label: StaticText.KARTAI_DECK_PACKAGE},
        {value: "csv", label: StaticText.CSV_FORMAT},
    ]

    const csvDelimiterOptions = [
        {value: "\t", label: "tab"},
        {value: ",", label: ","},
        {value: ";", label: ";"},
        {value: ":", label: ":"},
        {value: "|", label: "|"}
    ]

    return <KartAIBox>
        <KartAIModal
            title={StaticText.DOWNLOAD}
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            submitButtonText={StaticText.DOWNLOAD}
            loading={controller.states.loadingState.val}
        >
            <KartAISelect
                sx={{mb: 2}}
                fullWidth
                label={StaticText.DOWNLOAD_FORMAT}
                onChange={value => controller.states.selectedExportFormatState.set(value as "csv" | "kpkg")}
                value={controller.states.selectedExportFormatState.val}
                options={exportFormatOptions}
            />

            {controller.states.selectedExportFormatState.val === "csv" && <KartAISelect
                fullWidth
                label={StaticText.CSV_DELIMITER}
                onChange={controller.states.csvDelimiterState.set}
                value={controller.states.csvDelimiterState.val}
                options={csvDelimiterOptions}
            />}
        </KartAIModal>
    </KartAIBox>

}