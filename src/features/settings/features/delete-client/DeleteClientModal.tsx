import DeleteClientController from "./DeleteClientController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {Alert, Typography} from "@mui/material";

interface DeleteClientModalProps {
    controller: DeleteClientController
}

export default function ({controller}: DeleteClientModalProps) {

    return <KartAIBox>
        <KartAIModal loading={controller.states.loadingState.val} title={StaticText.DELETE_ACCOUNT}
                     show={controller.states.showState.val}
                     onClose={controller.close}
                     onSubmit={controller.submit}
                     submitButtonText={StaticText.DELETE}
        >
            <Typography sx={{fontSize: 17}}>{StaticText.DELETE_ACCOUNT_TEXT}</Typography>
            <Alert sx={{fontSize: 17}} severity="error">{StaticText.DELETE_ACCOUNT_WARNING_TEXT}</Alert>
        </KartAIModal>

    </KartAIBox>

}