import ChangeCardTypeController from "./ChangeCardTypeController";
import KartAIModal from "../../../../components/KartAIModal";
import KartAIBox from "../../../../components/ui/KartAIBox";
import {StaticText} from "../../../../data/text/staticText";
import KartAISelect from "../../../../components/ui/KartAISelect";
import {useMemo} from "react";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import FieldUtils from "../../../../utils/FieldUtils";
import {Typography} from "@mui/material";
import {ArrowForward} from "@mui/icons-material";


interface ChangeCardTypeModalProps {
    controller: ChangeCardTypeController
}

export default function ({controller}: ChangeCardTypeModalProps) {

    const cardTypeOptions = useMemo(() => {
        return CardTypeUtils.getInstance().toArray()
            .filter(cardType => cardType.id !== controller.cardsController.states.tempSelectedCardState.val?.cardTypeId)
            .map(cardType => ({
                value: cardType.id,
                label: cardType.name
            }))
    }, [controller.states.showState])

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

    const originCardType = useMemo(() => {
        try {
            return CardTypeUtils.getInstance().getById(controller.cardsController.states.tempSelectedCardState.val?.cardTypeId!)
        } catch (e) {
            return null
        }
    }, [controller.states.showState.val])

    const originCardTypeFields = useMemo(() => {
        if (!originCardType) return []
        return FieldUtils.getInstance().getAllBy("cardTypeId", originCardType.id)
    }, [controller.states.showState.val])

    const cardTypeFieldOptions = useMemo(() => {
        const options = cardTypeFields.map(field => ({
            value: field.id,
            label: field.name
        }))

        if (cardTypeFields.length < originCardTypeFields.length) {
            options.push({
                value: "EMPTY",
                label: `[${StaticText.EMPTY}]`
            })
        }

        return options
    }, [controller.states.selectedCardTypeIdState.val])


    return <KartAIBox>


        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            title={StaticText.CHANGE_CARD_TYPE}
        >
            <KartAISelect label={StaticText.CHANGE_TO_CARD_TYPE}
                          value={controller.states.selectedCardTypeIdState.val}
                          onChange={controller.states.selectedCardTypeIdState.set}
                          options={cardTypeOptions}
                          fullWidth
            />

            <Typography sx={{fontWeight: 550}} variant="h5">{StaticText.ASSIGN_FIELDS}</Typography>

            <KartAIBox>
                <KartAIBox flexSpaceBetween mt={2}>
                    <Typography variant="h6">{originCardType?.name}</Typography>

                    <Typography variant="h6">{selectedCardType?.name}</Typography>
                </KartAIBox>

                {originCardTypeFields
                    .map((field, index) => {
                        return <KartAIBox mt={2} flexCenter key={index}
                                          sx={{display: "flex", justifyContent: "center", alignItems: "center", mt: 2}}>
                            <KartAIBox fullWidth mr={1}>

                                <KartAISelect fullWidth
                                              label={StaticText.FIELD + ` (${index + 1})`}
                                              value={field.id}
                                              options={[
                                                  {value: field.id, label: field.name}
                                              ]}
                                />

                            </KartAIBox>
                            <ArrowForward/>
                            <KartAIBox fullWidth ml={1}>

                                <KartAISelect
                                    fullWidth
                                    label={StaticText.FIELD + ` (${index + 1})`}
                                    value={controller.states.fieldsChoiceState.val[field.id] || ""}
                                    onChange={value => {
                                        controller.states.fieldsChoiceState.set(prevState => {
                                            const clonedState = {...prevState}

                                            clonedState[field.id] = value

                                            return clonedState
                                        })
                                    }}
                                    options={cardTypeFieldOptions}
                                />
                            </KartAIBox>
                        </KartAIBox>
                    })}
            </KartAIBox>

        </KartAIModal>

    </KartAIBox>
}