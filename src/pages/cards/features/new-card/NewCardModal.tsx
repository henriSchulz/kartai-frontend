import NewCardController from "./NewCardController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import KartAISelect from "../../../../components/ui/KartAISelect";
import {useEffect, useMemo} from "react";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import {Divider} from "@mui/material";
import FieldUtils from "../../../../utils/FieldUtils";
import KartAITextField from "../../../../components/ui/KartAITextField";

interface NewCardModalProps {
    controller: NewCardController
}


export default function ({controller}: NewCardModalProps) {


    useEffect(() => {
        controller.setDefaultSelectedCardType()
    }, [])


    const cardTypeOptions = useMemo(() => {
        return CardTypeUtils.getInstance().toArray().map(cardType => ({
            label: cardType.name,
            value: cardType.id
        }))
    }, [controller.states.showState.val, controller.states.selectedCardTypeIdState.val])

    const fields = useMemo(() => {
        if (controller.states.selectedCardTypeIdState.val === "") return []
        return FieldUtils.getInstance().getAllBy("cardTypeId", controller.states.selectedCardTypeIdState.val)
    }, [controller.states.selectedCardTypeIdState.val])


    return <KartAIBox>


        <KartAIModal
            title={StaticText.NEW_CARD}
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            submitButtonText={StaticText.ADD}
        >

            <KartAISelect mb={1} fullWidth label={StaticText.CARD_TYPE}
                          value={controller.states.selectedCardTypeIdState.val}
                          onChange={controller.states.selectedCardTypeIdState.set}
                          options={cardTypeOptions}
            />
            <Divider/>

            <KartAIBox mt={2}>
                {fields.map((field, index) =>

                    <KartAITextField mt={index === 0 ? 0 : 1} fullWidth
                                     label={field.name}
                                     size="medium"
                                     variant="outlined"
                                     id={field.id}
                                     key={field.id}
                    />
                )}
            </KartAIBox>

        </KartAIModal>


    </KartAIBox>
}