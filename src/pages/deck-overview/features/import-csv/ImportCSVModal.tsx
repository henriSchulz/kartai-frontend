import ImportCSVController from "./ImportCSVController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {Button, Stack, Step, StepLabel, Stepper, Typography} from "@mui/material";
import KartAISelect from "../../../../components/ui/KartAISelect";
import {useMemo} from "react";
import DeckUtils from "../../../../utils/DeckUtils";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import {Add, ArrowForward} from "@mui/icons-material";
import FieldUtils from "../../../../utils/FieldUtils";

interface ImportCSVModalProps {
    controller: ImportCSVController
}


export default function ({controller}: ImportCSVModalProps) {


    const steps = [StaticText.READ_CSV, StaticText.ASSIGN_FIELDS];

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

    const selectedCardType = useMemo(() => {
        try {
            return CardTypeUtils.getInstance().getById(controller.states.selectedCardTypeIdState.val)
        } catch (e) {
            return null
        }
    }, [controller.states.selectedCardTypeIdState.val])

    const cardTypeFields = useMemo(() => {

        if (!selectedCardType) return []
        return FieldUtils.getInstance().getAllBy("cardTypeId", selectedCardType.id)
    }, [controller.states.selectedCardTypeIdState.val])

    const fieldOptions = useMemo(() => {
        if (!controller.states.parsedCsvState.val) return []
        if (controller.states.parsedCsvState.val.length === 0) return []


        const options = cardTypeFields.map(field => ({label: field.name, value: field.id}))

        if (cardTypeFields.length < controller.states.parsedCsvState.val[0].length) {
            options.push({label: `[${StaticText.EMPTY}]`, value: "EMPTY"})
        }

        return options
    }, [controller.states.selectedCardTypeIdState.val])

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
                     title={StaticText.IMPORT_CSV}
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
                        <Typography variant="h6">{StaticText.CSV_FIELDS}</Typography>
                        <Typography variant="h6">{selectedCardType?.name}</Typography>
                    </KartAIBox>


                    <Stack direction="column" spacing={2}>
                        {Array.from({length: controller.states.parsedCsvState.val[0].length}, (_, index) => {
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
                                                      label: StaticText.FIELD + ` ${index + 1}: ${controller.states.parsedCsvState.val[0][index]}`
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
                                                  options={fieldOptions}
                                    />
                                </KartAIBox>
                            </KartAIBox>

                        })}
                        <Button onClick={controller.submit} fullWidth sx={{mt: 1}}
                                variant="outlined">{StaticText.IMPORT}</Button>
                    </Stack>


                </KartAIBox>
            }


            {activeStep === 0 &&
                <KartAIBox mt={2}>
                    <KartAISelect fullWidth label={StaticText.CSV_DELIMITER}
                                  value={controller.states.csvDelimiterState.val}
                                  options={csvDelimiterOptions}
                                  onChange={controller.states.csvDelimiterState.set}
                    />


                    <Button sx={{mt: 2, alignSelf: "right"}} onClick={() => {
                        controller.onParseCsv()
                        controller.states.activeCsvImportStepState.set(prev => prev + 1)
                    }}
                            fullWidth variant="outlined">{StaticText.CONTINUE}</Button>
                </KartAIBox>
            }

        </KartAIModal>
    </KartAIBox>

}