import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {Button, Checkbox, FormControlLabel, Stack, Step, StepLabel, Stepper, Typography} from "@mui/material";
import KartAISelect from "../../../../components/ui/KartAISelect";
import {useMemo} from "react";
import DeckUtils from "../../../../utils/DeckUtils";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import {Add, ArrowForward} from "@mui/icons-material";
import FieldUtils from "../../../../utils/FieldUtils";
import ImportMarkdownTableController from "./ImportMarkdownTableController";
import KartAITextField from "../../../../components/ui/KartAITextField";
import KartAIButton from "../../../../components/ui/KartAIButton";

interface ImportMarkdownTableModalProps {
    controller: ImportMarkdownTableController
}


export default function ({controller}: ImportMarkdownTableModalProps) {
    const steps = [StaticText.READ_MARKDOWN_TABLE, StaticText.ASSIGN_FIELDS];

    const activeStep = controller.states.activeCsvImportStepState.val

    const deckSelectionsOptions = useMemo(() => {
        return DeckUtils.getInstance().toArray().map(deck => {
            return {
                value: deck.id,
                label: deck.name
            }
        })
    }, [controller.states.showState.val, controller.newDeckOrDirectoryController.states.showState.val])

    const cardTypeSelectionsOptions = useMemo(() => {
        return CardTypeUtils.getInstance().toArray().map(cardType => {
            return {
                value: cardType.id,
                label: cardType.name
            }
        })
    }, [controller.states.showState.val])


    const data = useMemo(() => {
        try {
            const selectedCardType = CardTypeUtils.getInstance().getById(controller.states.selectedCardTypeIdState.val)
            const cardTypeFields = FieldUtils.getInstance().getAllBy("cardTypeId", selectedCardType.id)
            const fieldOptions = cardTypeFields.map(field => ({label: field.name, value: field.id}))

            if(!controller.states.parsedCraftTableState.val[0]) return null

            if (cardTypeFields.length < controller.states.parsedCraftTableState.val[0].length) {
                fieldOptions.push({label: `[${StaticText.EMPTY}]`, value: "EMPTY"})
            }
            return {
                selectedCardType,
                fieldOptions,
                cardTypeFields
            }

        } catch (e) {
            return null
        }
    }, [controller.states.selectedCardTypeIdState.val, controller.states.showState.val])


    const csvDelimiterOptions = [
        {value: "\t", label: "tab"},
        {value: ",", label: ","},
        {value: ";", label: ";"},
        {value: ":", label: ":"},
        {value: "|", label: "|"}
    ]

    const newDeckAction = {
        onClick() {
            controller.newDeckOrDirectoryController.open(true)
        },
        text: StaticText.NEW_DECK,
        icon: <Add/>
    }


    return <KartAIBox>
        <KartAIModal hideButtons size="sm"
                     title={StaticText.IMPORT_MARKDOWN_TABLE}
                     show={controller.states.showState.val}
                     onClose={controller.close}
                     onSubmit={controller.submit}
                     submitButtonText={StaticText.IMPORT}
        >

            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step completed={activeStep === 1 && index === 0} key={index}>
                        <StepLabel>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>


            {activeStep === 1 &&
                <KartAIBox mt={2}>
                    <Stack direction="row" spacing={1}>
                        <KartAISelect fullWidth
                                      label={StaticText.DECK}
                                      value={controller.states.selectedDestinationDeckIdState.val}
                                      onChange={controller.states.selectedDestinationDeckIdState.set}
                                      options={deckSelectionsOptions}
                                      action={newDeckAction}
                        />

                        <KartAISelect fullWidth
                                      label={StaticText.CARD_TYPE}
                                      value={controller.states.selectedCardTypeIdState.val}
                                      onChange={controller.states.selectedCardTypeIdState.set}
                                      options={cardTypeSelectionsOptions}
                        />
                    </Stack>


                    <KartAIBox mt={2} flexSpaceBetween>
                        <Typography variant="h6">{StaticText.TABLE_FIELDS}</Typography>
                        <Typography variant="h6">{data?.selectedCardType?.name}</Typography>
                    </KartAIBox>


                    <Stack direction="column" spacing={2}>
                        {Array.from({length: controller.states.parsedCraftTableState.val[0].length}, (_, index) => {
                            return <KartAIBox key={index}
                                              sx={{
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  alignItems: "center",
                                                  mt: 2
                                              }}>
                                <KartAIBox sx={{width: "100%", mr: 1}}>

                                    <KartAISelect fullWidth
                                                  value={String(index)}
                                                  options={[{
                                                      value: String(index),
                                                      label: StaticText.FIELD + ` ${index + 1}: ${controller.states.parsedCraftTableState.val[0][index]}`
                                                  }]}
                                    />

                                </KartAIBox>
                                <ArrowForward/>
                                <KartAIBox sx={{width: "100%", ml: 1}}>


                                    <KartAISelect fullWidth
                                                  label={StaticText.FIELD + ` (${index + 1})`}
                                                  value={controller.states.fieldsChoiceState.val[index] || ""}
                                                  onChange={value => {
                                                      controller.states.fieldsChoiceState.set(prevState => {
                                                          const clonedState = {...prevState}
                                                          clonedState[index] = value
                                                          return clonedState
                                                      })
                                                  }}
                                                  options={data?.fieldOptions ?? []}
                                    />
                                </KartAIBox>
                            </KartAIBox>

                        })}
                        <KartAIButton loading={controller.states.loadingState.val} onClick={controller.submit} fullWidth
                                      mt={1}
                                      variant="outlined">{StaticText.IMPORT}</KartAIButton>
                    </Stack>


                </KartAIBox>
            }


            {activeStep === 0 &&
                <KartAIBox gridStart mt={4}>
                    <FormControlLabel control={<Checkbox id="table-head" />} label={StaticText.TABLE_HEAD}/>
                    <KartAITextField mt={2} rows={5} multiline fullWidth id="markdown-text" label={StaticText.MARKDOWN_TABLE}
                                     variant="outlined"/>



                    <KartAIButton mt={2} loading={controller.states.loadingState.val} sx={{alignSelf: "right"}}
                                  onClick={controller.onParseMarkdownTable}
                                  fullWidth
                                  variant="outlined">
                        {StaticText.CONTINUE}
                    </KartAIButton>
                </KartAIBox>
            }

        </KartAIModal>
    </KartAIBox>

}