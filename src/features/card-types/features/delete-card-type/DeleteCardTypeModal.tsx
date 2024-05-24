import DeleteCardTypeController from "./DeleteCardTypeController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {Alert} from "@mui/material";
import {useMemo} from "react";

interface DeleteCardTypeModalProps {
    controller: DeleteCardTypeController
}

export default function ({controller}: DeleteCardTypeModalProps) {


    const affectedCards = useMemo(controller.getAffectedCardCount, [controller.states.showState.val])

    return <KartAIBox>
        <KartAIModal
            title={StaticText.DELETE_CARD_TYPE}
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            submitButtonText={StaticText.DELETE}
        >
            <Alert sx={{fontSize: 17}} severity="error">
                {StaticText.CARD_TYPE_CARD_DELETE_CASCADE.replaceAll("{num}", affectedCards.toString())}
            </Alert>


        </KartAIModal>

    </KartAIBox>
}