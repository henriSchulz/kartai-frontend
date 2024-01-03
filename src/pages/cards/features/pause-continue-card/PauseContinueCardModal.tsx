import PauseContinueCardController from "./PauseContinueCardController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {Alert} from "@mui/material";
import {useMemo} from "react";

interface PauseContinueCardModalProps {
    controller: PauseContinueCardController
}

export default function ({controller}: PauseContinueCardModalProps) {


    const {title, text} = useMemo(controller.getTexts, [controller.states.showState.val])

    return <KartAIBox>

        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            title={title}
        >
            <Alert severity="info">
                {text}
            </Alert>
        </KartAIModal>


    </KartAIBox>

}