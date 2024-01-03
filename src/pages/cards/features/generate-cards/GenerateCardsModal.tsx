import GenerateCardsController from "./GenerateCardsController";
import KartAIModal from "../../../../components/KartAIModal";
import KartAIBox from "../../../../components/ui/KartAIBox";
import {StaticText} from "../../../../data/text/staticText";
import React, {useEffect, useMemo} from "react";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import KartAISelect from "../../../../components/ui/KartAISelect";
import {Step, StepLabel, Stepper} from "@mui/material";
import KartAIButton from "../../../../components/ui/KartAIButton";
import {Add, AutoAwesome, CloudUpload, Description, Drafts, Forward, ForwardOutlined, Image} from "@mui/icons-material";
import InvisibleFileSelector from "../../../../components/InvisibleFileSelector";
import ListViewContent from "../../../../components/list-view/ListViewContent";
import GeneratedCardItem from "./GeneratedCardItem";

interface GenerateCardsModalProps {
    controller: GenerateCardsController
}


export default function ({controller}: GenerateCardsModalProps) {

    const uploadedFile = controller.states.uploadedFileState.val

    const steps = [StaticText.GENERATE_CARDS, StaticText.EVALUATE_CARDS];

    const cardTypeSelectOptions = useMemo(() => {
        if (!controller.states.showState.val) return []
        return CardTypeUtils.getInstance().toArray().map(cardType => ({value: cardType.id, label: cardType.name}))
    }, [controller.states.showState.val])

    useEffect(() => {

        document.addEventListener("paste", controller.onPasteFile)

        return () => {
            document.removeEventListener("paste", controller.onPasteFile)
        }

    }, [controller.states.uploadedFileState.val])

    const getIcon = () => {
        if (!uploadedFile) {
            return <CloudUpload/>
        }

        if (controller.getFileType(uploadedFile) === "img") {
            return <Image/>
        }

        return <Description/>
    }

    return <KartAIBox>


        <KartAIModal notCancelable={controller.states.loadingState.val} show={controller.states.showState.val}
                     onClose={controller.close}
                     title={StaticText.GENERATE_CARDS}
                     hideButtons
                     size={controller.states.activeGenerateCardsStepState.val === 0 ? "xs" : "md"}
        >

            <Stepper nonLinear activeStep={controller.states.activeGenerateCardsStepState.val}>
                {steps.map((label, index) => (
                    <Step completed={controller.states.activeGenerateCardsStepState.val === 1 && index === 0}
                          key={index}>
                        <StepLabel>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            {controller.states.activeGenerateCardsStepState.val === 0 &&
                <KartAIBox mt={3}>
                    <KartAISelect disabled={controller.states.loadingState.val} fullWidth mb={2}
                                  label={StaticText.CARD_TYPE}
                                  value={controller.states.selectedCardTypeIdState.val}
                                  onChange={controller.states.selectedCardTypeIdState.set}
                                  options={cardTypeSelectOptions}/>

                    <KartAIButton disabled={controller.states.loadingState.val} onClick={controller.onOpenFileSelector}
                                  startIcon={getIcon()}
                                  size="large"
                                  mb={4}
                                  color="secondary"
                                  variant="outlined"
                                  fullWidth>
                        {uploadedFile ? uploadedFile.name : StaticText.UPLOAD_FILE}
                    </KartAIButton>
                    <InvisibleFileSelector accept="image/*, text/plain, application/pdf"
                                           id="generate-cards-file-selector"
                                           onFileSelected={controller.onUploadFile}/>

                    <KartAIButton loadingText={StaticText.LOADING}
                                  onClick={controller.onContinue}
                                  variant="contained"
                                  fullWidth
                                  loading={controller.states.loadingState.val}>
                        {StaticText.CONTINUE}
                    </KartAIButton>

                </KartAIBox>
            }

            {controller.states.activeGenerateCardsStepState.val === 1 && <KartAIBox mt={3}>
                <KartAIBox mb={4}>
                    <ListViewContent fullHeight>
                        {controller.states.generatedCardsState.val.map(card => {
                            return <GeneratedCardItem controller={controller} card={card} key={card.id}/>
                        })}
                    </ListViewContent>
                </KartAIBox>

                <KartAIBox fullWidth flexCenter>
                    <KartAIButton loading={controller.states.loadingState.val} startIcon={<AutoAwesome/>} mr={2} fullWidth variant="contained"
                                  onClick={controller.onContinue}>
                        {StaticText.REGENERATE_CARDS}
                    </KartAIButton>

                    <KartAIButton loading={controller.states.loadingState.val} startIcon={<Add/>} fullWidth variant="contained" onClick={controller.submit}>
                        {StaticText.ADD_CARDS}
                    </KartAIButton>

                </KartAIBox>

            </KartAIBox>}


        </KartAIModal>

    </KartAIBox>

}