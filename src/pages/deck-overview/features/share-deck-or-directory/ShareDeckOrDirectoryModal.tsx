import {Typography, Alert} from "@mui/material";
import ShareDeckOrDirectoryController from "./ShareDeckOrDirectoryController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import {StaticText} from "../../../../data/text/staticText";
import KartAIModal from "../../../../components/KartAIModal";

interface ShareDeckOrDirectoryModalProps {
    controller: ShareDeckOrDirectoryController
}


export default function ({controller}: ShareDeckOrDirectoryModalProps) {

    const isDir = Boolean(controller.deckOverviewController.states.tempDeckOrDirectoryState.val?.isDirectory)

    return <KartAIBox>
        <KartAIModal
            show={controller.states.showState.val}
            onSubmit={controller.submit}
            onClose={controller.close}
            title={isDir ? StaticText.PUBLISH_FOLDER : StaticText.PUBLISH_DECK}
        >
            <Typography sx={{
                mb: 2,
                fontSize: 20
            }}>{!isDir ? StaticText.PUBLISH_DECK_TEXT : StaticText.PUBLISH_FOLDER_TEXT}</Typography>
            <Alert sx={{fontSize: 17}}
                   severity="info">{!isDir ? StaticText.PUBLISH_DECK_NOTE : StaticText.PUBLISH_FOLDER_NOTE}</Alert>
        </KartAIModal>
    </KartAIBox>
}