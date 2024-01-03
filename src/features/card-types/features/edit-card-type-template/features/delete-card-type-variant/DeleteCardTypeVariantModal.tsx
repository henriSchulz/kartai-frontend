import DeleteCardTypeVariantController from "./DeleteCardTypeVariantController";
import KartAIBox from "../../../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../../../components/KartAIModal";
import {StaticText} from "../../../../../../data/text/staticText";
import {Alert} from "@mui/material";

interface DeleteCardTypeVariantModalProps {
    controller: DeleteCardTypeVariantController
}


export default function ({controller}: DeleteCardTypeVariantModalProps) {

    return <KartAIBox>
        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            title={StaticText.DELETE_VARIANT}
        >
            <Alert severity="error">
                {StaticText.DELETE_VARIANT_TEXT}
            </Alert>
        </KartAIModal>
    </KartAIBox>

}