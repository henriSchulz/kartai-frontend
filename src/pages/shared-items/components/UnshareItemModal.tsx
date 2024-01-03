import UnshareItemController from "../features/unshare-item/UnshareItemController";
import KartAIModal from "../../../components/KartAIModal";
import KartAIBox from "../../../components/ui/KartAIBox";
import {StaticText} from "../../../data/text/staticText";
import {Alert} from "@mui/material";

interface UnshareItemModalProps {
    controller: UnshareItemController
}

export default function ({controller}: UnshareItemModalProps) {
    return <KartAIBox>
        <KartAIModal show={controller.states.showState.val}
                     onSubmit={controller.submit}
                     onClose={controller.close}
                     title={StaticText.UNSHARE_ITEM}>
            <Alert sx={{fontSize: 17}} severity="info">
                {StaticText.UNSHARE_ITEM_TEXT}
            </Alert>
        </KartAIModal>

    </KartAIBox>
}