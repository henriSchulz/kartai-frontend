import DeleteCardTypeController from "./DeleteCardTypeController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {Alert} from "@mui/material";

interface DeleteCardTypeModalProps {
    controller: DeleteCardTypeController
}

export default function ({controller}: DeleteCardTypeModalProps) {
    return <KartAIBox>
        <KartAIModal
            title={StaticText.DELETE_CARD_TYPE}
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            submitButtonText={StaticText.DELETE}
        >
            <Alert severity="error">{StaticText.DELETE_CARD_TYPE_TEXT}</Alert>
        </KartAIModal>

    </KartAIBox>
}