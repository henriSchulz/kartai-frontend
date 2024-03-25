import EditCardController from "./EditCardController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import KartAITextField from "../../../../components/ui/KartAITextField";
import {useEffect, useMemo} from "react";
import FieldContentPair from "../../../../types/FieldContentPair";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import {Breakpoint, ButtonGroup} from "@mui/material";
import KartAIButton from "../../../../components/ui/KartAIButton";
import {insertFormatting, insertFormattingActiveTextArea} from "../../../../utils/general";
import {FormatBold, FormatItalic} from "@mui/icons-material";
import FormatInkHighlighter from "../../../../asserts/FormatInkHighlighter";
import Function from "../../../../asserts/Function";

interface EditCardModalProps {
    controller: EditCardController
}


export default function ({controller}: EditCardModalProps) {


    useEffect(() => {


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

    const fieldContentPairs: FieldContentPair[] = useMemo(() => {
        const card = controller.card
        if (!card) return []
        return FieldContentUtils.getInstance().getFieldContentPairs(card.id)
    }, [controller.states.showState.val])

    const size = useMemo(() => {
        const maxLength = Math.max(...fieldContentPairs.map(fcp => fcp.fieldContent.content.length))

        if (maxLength > 400) return "sm" as Breakpoint

        return "xs" as Breakpoint
    }, [fieldContentPairs])


    return <KartAIBox>
        <KartAIModal
            title={StaticText.EDIT_CARD}
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            size={size}
        >

            <ButtonGroup variant="outlined">
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
            </ButtonGroup>

            {fieldContentPairs.map((fieldContentPair, index) =>
                <KartAITextField mt={1} fullWidth
                                 label={fieldContentPair.field.name}
                                 size="medium"
                                 multiline
                                 variant="outlined"
                                 id={fieldContentPair.field.id}
                                 key={fieldContentPair.field.id}
                                 defaultValue={fieldContentPair.fieldContent.content}
                />
            )}
        </KartAIModal>

    </KartAIBox>

}