import KartAIBox from "../../../../components/ui/KartAIBox";
import DeleteDeckOrDirectoryController from "./DeleteDeckOrDirectoryController";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {useMemo} from "react";
import {Alert} from "@mui/material";


interface DeleteDeckOrDirectoryModalProps {
    controller: DeleteDeckOrDirectoryController
}

export default function ({controller}: DeleteDeckOrDirectoryModalProps) {


    const {
        title,
        text
    } = useMemo(controller.getTexts, [controller.deckOverviewController.states.selectedEntitiesState.val,
        controller.states.showState])

    return <KartAIBox>

        <KartAIModal
            onClose={controller.close}
            title={title}
            show={controller.states.showState.val}
            onSubmit={controller.submit}
            submitButtonText={StaticText.DELETE}
        >

            <Alert sx={{fontSize: 17}} severity="error">{text}</Alert>
        </KartAIModal>

    </KartAIBox>
}