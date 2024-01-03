import ResetCardController from "./ResetCardController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {useMemo} from "react";
import {Alert} from "@mui/material";

interface ResetCardControllerProps {
    controller: ResetCardController
}

export default function ({controller}: ResetCardControllerProps) {

    const {title, text} = useMemo(controller.getTexts, [controller.states.showState.val])

    return <KartAIBox>
        <KartAIModal
            title={title}
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
        >
            <Alert severity="info">
                {text}
            </Alert>

        </KartAIModal>

    </KartAIBox>

}