import EditCardController from "./EditCardController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import KartAITextField from "../../../../components/ui/KartAITextField";
import React, {useEffect, useMemo} from "react";
import FieldContentPair from "../../../../types/FieldContentPair";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import {Breakpoint, ButtonGroup} from "@mui/material";
import KartAIButton from "../../../../components/ui/KartAIButton";
import {insertFormatting, insertFormattingActiveTextArea, insertHeader, insertImage} from "../../../../utils/general";
import {FormatBold, FormatItalic, Image, Title} from "@mui/icons-material";
import FormatInkHighlighter from "../../../../assets/FormatInkHighlighter";
import Function from "../../../../assets/Function";
import KartAISelect from "../../../../components/ui/KartAISelect";
import KartAIPopperMenu from "../../../../components/KartAIPopperMenu";
import FormatHeadline from "../../../../assets/FormatHeadline";

interface EditCardModalProps {
    controller: EditCardController
}


export default function ({controller}: EditCardModalProps) {
    const [headlineMenuAnchorEl, setHeadlineMenuAnchorEl] = React.useState<null | HTMLElement>(null)

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

    const headlineMenuItems = Array.from({length: 6}, (_, i) => i + 1).map(i => ({
        icon: <FormatHeadline type={i}/>,
        text: StaticText.HEADLINE + " " + i,
        onClick: () => insertHeader(i)
    }))


    return <KartAIBox>
        <KartAIModal
            title={StaticText.EDIT_CARD}
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            size={size}
        >

            <ButtonGroup variant="outlined">
                {/*<KartAIButton onClick={e => setHeadlineMenuAnchorEl(e.currentTarget)} variant="outlined">*/}
                {/*    <Title/>*/}
                {/*</KartAIButton>*/}

                {/*<KartAIPopperMenu*/}

                {/*    orientation="top"*/}
                {/*    menuItems={headlineMenuItems}*/}
                {/*    show={Boolean(headlineMenuAnchorEl)}*/}
                {/*    onClose={() => setHeadlineMenuAnchorEl(null)}*/}
                {/*    anchorEl={headlineMenuAnchorEl}*/}
                {/*/>*/}

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
                <KartAIButton onClick={() => insertImage()} variant="outlined">
                    <Image/>
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