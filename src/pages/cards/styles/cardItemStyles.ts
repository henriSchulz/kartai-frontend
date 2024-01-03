import {SxProps} from "@mui/system";
import {Theme} from "@mui/material";
import {learnCardsCountColor, pausedColor, reviewCardsCountColor} from "../../../styles/root";
import {row} from "../../../styles/listView";

export function cardRow(selected: boolean, status: "due" | "done" | "paused"): SxProps<Theme> {

    const borderColor = status === "due" ? learnCardsCountColor : status === "done" ? reviewCardsCountColor : pausedColor

    return {
        ...row(selected),
        padding: "4px 20px !important",
        borderLeft: `5px solid ${borderColor} !important`,
    }
}


export function fieldContentStyle(numFieldContents: number): SxProps<Theme> {
    return {
        maxWidth: 600 / numFieldContents,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        display: "inline-block",
    }
}