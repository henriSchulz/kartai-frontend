import GenerateCardsController from "./GenerateCardsController";
import Card from "../../../../types/dbmodel/Card";
import React, {useMemo} from "react";
import KartAIBox from "../../../../components/ui/KartAIBox";
import {row} from "../../../../styles/listView";
import {Tooltip, Typography} from "@mui/material";
import {fieldContentStyle} from "../../styles/cardItemStyles";
import OutlinedIconButton from "../../../../components/OutlinedIconButton";
import {Delete, Edit} from "@mui/icons-material";

interface GeneratedCardItemProps {
    controller: GenerateCardsController
    card: Card
}


export default function ({controller, card}: GeneratedCardItemProps) {

    const fieldContents = useMemo(() => {
        return controller.states.generatedFieldContentsState.val.filter(fieldContent => fieldContent.cardId === card.id)
    }, [card])

    return <KartAIBox sx={row(false)} flexSpaceBetween>
        <KartAIBox flexSpaceBetween sx={{width: "90%"}}>
            {fieldContents.map((fieldContent, index) => {
                return <Tooltip key={fieldContent.id} title={fieldContent.content}>
                    <Typography sx={fieldContentStyle(fieldContents.length)} mr={5}
                    >{fieldContent.content}</Typography>
                </Tooltip>
            })}
        </KartAIBox>

        <KartAIBox>
            <KartAIBox sx={{display: "inline-block"}}>
                <OutlinedIconButton disabled={controller.states.loadingState.val}
                                    onClick={() => controller.removeCard(card)}>
                    <Delete/>
                </OutlinedIconButton>
            </KartAIBox>
        </KartAIBox>
    </KartAIBox>
}

