import FieldContentPair from "../../../types/FieldContentPair";
import KartAIBox from "../../../components/ui/KartAIBox";
import {row} from "../../../styles/listView";
import {Tooltip, Typography} from "@mui/material";
import {fieldContentStyle} from "../../cards/styles/cardItemStyles";
import React from "react";

interface SampleCardViewItemProps {
    fieldContentPairs: FieldContentPair[]
}

export default function ({fieldContentPairs}: SampleCardViewItemProps) {

    if (fieldContentPairs.length === 0) return <></>

    return <KartAIBox flexSpaceBetween sx={row(false)}>
        {fieldContentPairs.map((fieldContentPair, index) => {
            return <Tooltip key={fieldContentPair.fieldContent.id} title={fieldContentPair.fieldContent.content}>
                <Typography sx={fieldContentStyle(fieldContentPairs.length)} mr={5}
                >{fieldContentPair.fieldContent.content}</Typography>
            </Tooltip>
        })}
    </KartAIBox>

}