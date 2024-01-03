import RenameCardTypeVariantController from "./RenameCardTypeVariantController";
import KartAIBox from "../../../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../../../components/KartAIModal";
import {StaticText} from "../../../../../../data/text/staticText";
import KartAITextField from "../../../../../../components/ui/KartAITextField";

interface RenameCardTypeVariantModalProps {
    controller: RenameCardTypeVariantController
}

export default function ({controller}: RenameCardTypeVariantModalProps) {
    return <KartAIBox>

        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            title={StaticText.RENAME_VARIANT}>
            <KartAITextField autoFocus
                             fullWidth
                             defaultValue={controller.editCardTypeTemplateController.states.tempSelectedCardTypeVariantState.val?.name}
                             label={StaticText.VARIANT_NAME}
                             size="medium"
                             id="card-type-variant-name"
                             variant="filled"/>
        </KartAIModal>

    </KartAIBox>
}