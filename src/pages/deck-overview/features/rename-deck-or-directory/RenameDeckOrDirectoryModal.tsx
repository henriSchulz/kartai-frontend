import RenameDeckOrDirectoryController from "./RenameDeckOrDirectoryController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import {StaticText} from "../../../../data/text/staticText";
import KartAIModal from "../../../../components/KartAIModal";
import KartAITextField from "../../../../components/ui/KartAITextField";

interface RenameDeckOrDirectoryModalProps {
    controller: RenameDeckOrDirectoryController
}

export default function ({controller}: RenameDeckOrDirectoryModalProps) {
    return <KartAIBox>
        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            title={controller.deckOverviewController.states.tempDeckOrDirectoryState?.val?.isDirectory ? StaticText.RENAME_FOLDER : StaticText.RENAME_DECK}
            submitButtonText={StaticText.RENAME}
        >
            <KartAITextField
                defaultValue={controller.deckOverviewController.states.tempDeckOrDirectoryState?.val?.name}
                id="deckOrDirectoryName"
                label={controller.deckOverviewController.states.tempDeckOrDirectoryState?.val?.isDirectory ? StaticText.DECK_NAME : StaticText.FOLDER_NAME}
                size="medium" fullWidth variant="filled"/>
        </KartAIModal>
    </KartAIBox>

}