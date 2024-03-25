import CardPreviewController from "./CardPreviewController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import CardContent from "../../../study-cards/components/CardContent";
import React, {useMemo, useState} from "react";
import KartAIButton from "../../../../components/ui/KartAIButton";
import {ArrowBack, ArrowForward, EditNote} from "@mui/icons-material";
import EditCardController from "../edit-card/EditCardController";
import EditCardModal from "../edit-card/EditCardModal";


interface CardPreviewModalProps {
    controller: CardPreviewController
}


export default function ({controller}: CardPreviewModalProps) {


    const [showEditCardModal, setShowEditCardModal] = useState(false)

    const data = useMemo(controller.loadData, [controller.states.showState.val, showEditCardModal])

    const editCardController = new EditCardController({
        snackbar: controller.snackbar, states: {
            showState: {val: showEditCardModal, set: setShowEditCardModal}
        },
        card: controller.cardsController.states.tempSelectedCardState.val
    })

    return <KartAIBox>

        {showEditCardModal && <EditCardModal controller={editCardController}/>}

        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            title={StaticText.PREVIEW}
            hideCancelButton
            submitButtonText={StaticText.GO_BACK}
            onSubmit={controller.close}
            size="lg"
            actionButton={{
                onClick: editCardController.open,
                text: StaticText.EDIT,
                icon: <EditNote/>

            }}
        >

            {data && <KartAIBox styled gridCenter>
                <CardContent fieldContentPairs={data.fieldContentPairs}
                             templateBack={data.templateBack}
                             templateFront={data.templateFront}
                             backHidden={controller.states.currentTemplateState.val === "front"}
                />
            </KartAIBox>
            }

            <KartAIBox mt={2} spacing={4} flexSpaceBetween>
                <KartAIButton fullWidth startIcon={<ArrowBack/>}
                              disabled={controller.states.currentTemplateState.val === "front"}
                              onClick={() => controller.states.currentTemplateState.set("front")} variant="contained">
                    {StaticText.FRONT}
                </KartAIButton>
                <KartAIButton endIcon={<ArrowForward/>}
                              disabled={controller.states.currentTemplateState.val === "back"}
                              fullWidth onClick={() => controller.states.currentTemplateState.set("back")}
                              variant="contained">
                    {StaticText.BACK}
                </KartAIButton>
            </KartAIBox>

        </KartAIModal>


    </KartAIBox>

}