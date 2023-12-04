import NewDeckOrDirectoryController from "./NewDeckOrDirectoryController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import KartAITextField from "../../../../components/ui/KartAITextField";

interface NewDeckOrDirectoryModalProps {
    controller: NewDeckOrDirectoryController
}

export default function ({controller}: NewDeckOrDirectoryModalProps) {


    return <KartAIBox>
        <KartAIModal onClose={controller.close}
                     title={controller.states.isCreatingDeckState.val ? StaticText.NEW_DECK : StaticText.NEW_FOLDER}
                     show={controller.states.showState.val}
                     onSubmit={controller.submit}
        >

            <KartAITextField id="deckOrDirectoryName"
                             label={controller.states.isCreatingDeckState.val ? StaticText.DECK_NAME : StaticText.FOLDER_NAME}
                             size="medium" fullWidth variant="filled"/>
        </KartAIModal>
    </KartAIBox>

}