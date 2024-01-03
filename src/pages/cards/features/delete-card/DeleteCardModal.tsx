import DeleteCardController from "./DeleteCardController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {useMemo} from "react";
import {Alert} from "@mui/material";

interface DeleteCardModalProps {
    controller: DeleteCardController
}

export default function ({controller}: DeleteCardModalProps) {

    const {title, text} = useMemo(controller.getTexts, [controller.states.showState.val])

    return <KartAIBox>
        <KartAIModal
            title={title}
            submitButtonText={StaticText.DELETE}
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
        >
            <Alert sx={{fontSize: 17}} severity="error">{text}</Alert>
        </KartAIModal>

    </KartAIBox>
}