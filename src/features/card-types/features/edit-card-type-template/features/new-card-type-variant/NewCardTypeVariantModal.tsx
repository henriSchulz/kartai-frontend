import NewCardTypeVariantController from "./NewCardTypeVariantController";
import KartAIBox from "../../../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../../../components/KartAIModal";
import {StaticText} from "../../../../../../data/text/staticText";
import KartAITextField from "../../../../../../components/ui/KartAITextField";

interface NewCardTypeVariantModalProps {
    controller: NewCardTypeVariantController
}

export default function ({controller}: NewCardTypeVariantModalProps) {


    return <KartAIBox>


        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            title={StaticText.NEW_VARIANT}
        >
            <KartAITextField
                autoFocus
                id="card-type-variant-name"
                label={StaticText.VARIANT_NAME}
                size="medium"
                variant="filled"
                fullWidth
            />
        </KartAIModal>

    </KartAIBox>

}