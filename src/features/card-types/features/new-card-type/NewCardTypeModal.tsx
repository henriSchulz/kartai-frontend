import NewCardTypeController from "./NewCardTypeController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {Button, ButtonGroup, Divider, Typography} from "@mui/material";
import KartAITextField from "../../../../components/ui/KartAITextField";
import {numberArray} from "../../../../utils/general";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface NewCardTypeModalProps {
    controller: NewCardTypeController
}


export default function ({controller}: NewCardTypeModalProps) {

    return <KartAIBox>
        <KartAIModal show={controller.states.showState.val}
                     onClose={controller.close}
                     onSubmit={controller.submit}
                     title={StaticText.NEW_CARD_TYPE}
        >

            <KartAITextField id="card-type-name" size="medium" label={StaticText.NAME} variant="outlined" fullWidth/>

            <KartAIBox flexSpaceBetween mt={2} mb={1}>
                <Typography sx={{mr: 2}}>{StaticText.NUM_FIELDS}: {controller.states.numOfFieldsState.val}</Typography>
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            controller.states.numOfFieldsState.set(prevState => {
                                if (prevState === 2) return prevState
                                return prevState - 1
                            })
                        }}
                    >
                        <RemoveIcon fontSize="small"/>
                    </Button>
                    <Button
                        onClick={() => {
                            controller.states.numOfFieldsState.set((prevState => {
                                if (prevState === 6) return prevState
                                return prevState + 1
                            }))
                        }}
                    >
                        <AddIcon fontSize="small"/>
                    </Button>
                </ButtonGroup>
            </KartAIBox>

            <Divider/>

            <KartAIBox mt={2}>
                {numberArray(0, controller.states.numOfFieldsState.val - 1).map(fieldNum => {
                    return <KartAITextField key={fieldNum} mb={1.2} size="medium" id={`field-name-${fieldNum}`}
                                            label={`${StaticText.NAME}: ${StaticText.FIELD} ${fieldNum + 1}`}
                                            variant="outlined" fullWidth/>
                })}
            </KartAIBox>

        </KartAIModal>
    </KartAIBox>
}