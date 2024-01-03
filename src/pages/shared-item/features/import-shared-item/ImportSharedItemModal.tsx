import ImportSharedItemController from "./ImportSharedItemController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {Alert} from "@mui/material";

interface ImportSharedItemModalProps {
    controller: ImportSharedItemController
}

export default function ({controller}: ImportSharedItemModalProps) {

    const importData = controller.sharedItemController.states.importDataState.val
    const sharedItem = controller.sharedItemController.states.sharedItemState.val

    return <KartAIBox>

        <KartAIModal
            title={StaticText.IMPORT}
            onSubmit={controller.submit}
            onClose={controller.close}
            loading={controller.states.loadingState.val}
            show={controller.states.showState.val}>
            <Alert sx={{fontSize: 17}} severity="info">
                {StaticText.IMPORT_CARDS_TEXT
                    .replaceAll("{cards}", importData?.cards.length.toString() ?? "0")
                    .replaceAll("{name}", sharedItem?.sharedItemName ?? "Unknown")
                }
            </Alert>
        </KartAIModal>
    </KartAIBox>
}