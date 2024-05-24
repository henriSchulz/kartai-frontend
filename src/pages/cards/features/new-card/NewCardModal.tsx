import NewCardController from "./NewCardController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import KartAISelect from "../../../../components/ui/KartAISelect";
import {useEffect, useMemo} from "react";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import {ButtonGroup, Divider} from "@mui/material";
import FieldUtils from "../../../../utils/FieldUtils";
import KartAITextField from "../../../../components/ui/KartAITextField";
import KartAIButton from "../../../../components/ui/KartAIButton";
import {FormatBold, FormatItalic, Functions, HighlightTwoTone, Image} from "@mui/icons-material";
import OutlinedIconButton from "../../../../components/OutlinedIconButton";
import FormatInkHighlighter from "../../../../assets/FormatInkHighlighter";
import Function from "../../../../assets/Function";
import {insertFormatting, insertFormattingActiveTextArea} from "../../../../utils/general";

interface NewCardModalProps {
    controller: NewCardController
}


export default function ({controller}: NewCardModalProps) {


    useEffect(() => {
        controller.setDefaultSelectedCardType()

        const keyboardShortcuts = {
            "i": () => insertFormattingActiveTextArea("*"),
            "b": () => insertFormattingActiveTextArea("**"),
            "h": () => insertFormattingActiveTextArea("`"),
            "e": () => insertFormattingActiveTextArea("$"),
        }

        const handler = controller.getOnKeyboardShortcuts(keyboardShortcuts, false)

        window.addEventListener("keydown", handler)

        return () => {
            window.removeEventListener("keydown", handler)
        }


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

            <ButtonGroup sx={{mt: 2}} variant="outlined">
                <KartAIButton onClick={() => insertFormatting("*")} variant="outlined">
                    <FormatItalic/>
                </KartAIButton>
                <KartAIButton onClick={() => insertFormatting("**")} variant="outlined">
                    <FormatBold/>
                </KartAIButton>
                <KartAIButton onClick={() => insertFormatting("`")} variant="outlined">
                    <FormatInkHighlighter/>
                </KartAIButton>
                <KartAIButton onClick={() => insertFormatting("$")} variant="outlined">
                    <Function/>
                </KartAIButton>
                <KartAIButton onClick={() => insertFormatting("image")} variant="outlined">
                    <Image/>
                </KartAIButton>
            </ButtonGroup>

            <KartAIBox mt={1}>
                {fields.map((field, index) =>

                    <KartAITextField mt={index === 0 ? 0 : 1} fullWidth
                                     label={field.name}
                                     size="medium"
                                     variant="outlined"
                                     multiline
                                     id={field.id}
                                     key={field.id}
                    />
                )}
            </KartAIBox>

        </KartAIModal>


    </KartAIBox>
}