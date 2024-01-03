import EditCardController from "./EditCardController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import KartAITextField from "../../../../components/ui/KartAITextField";
import {useMemo} from "react";
import FieldContentPair from "../../../../types/FieldContentPair";
import FieldContentUtils from "../../../../utils/FieldContentUtils";

interface EditCardModalProps {
    controller: EditCardController
}


export default function ({controller}: EditCardModalProps) {

    const fieldContentPairs: FieldContentPair[] = useMemo(() => {
        const card = controller.card
        if (!card) return []
        return FieldContentUtils.getInstance().getFieldContentPairs(card.id)
    }, [controller.states.showState.val])

    return <KartAIBox>
        <KartAIModal
            title={StaticText.EDIT_CARD}
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
        >
            {fieldContentPairs.map((fieldContentPair, index) =>
                <KartAITextField mt={index === 0 ? 0 : 1} fullWidth
                                 label={fieldContentPair.field.name}
                                 size="medium"
                                 variant="outlined"
                                 id={fieldContentPair.field.id}
                                 key={fieldContentPair.field.id}
                                 defaultValue={fieldContentPair.fieldContent.content}
                />
            )}
        </KartAIModal>

    </KartAIBox>

}