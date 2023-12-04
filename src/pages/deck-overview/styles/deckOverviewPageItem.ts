import {SxProps} from "@mui/system";
import {Theme} from "@mui/material";
import {learnCardsCountColor, loadingGray, newCardsCountColor, reviewCardsCountColor} from "../../../styles/root";


export const deckOverviewItemTitle: SxProps<Theme> = {
    fontSize: {xs: "1.2rem"},
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "inline-block",
    maxWidth: {lg: 550, xl: 550, md: 550, sm: 400, xs: 200}
}

export const deckOverviewItemTitleButton: SxProps<Theme> = {
    py: 1,
    fontSize: 30,
    pl: 2,
    pr: 7
}

export function deckOverviewCardsCount(cardLevel: "new" | "learning" | "review", noCards: boolean): SxProps<Theme> {
    const basic: SxProps<Theme> = {
        fontSize: 20,
        m: 1,
    }

    if (noCards) {
        return {
            ...basic,
            color: loadingGray
        }
    }

    switch (cardLevel) {
        case "new":
            return {
                ...basic,
                color: newCardsCountColor
            }
        case "learning":
            return {
                ...basic,
                color: learnCardsCountColor
            }
        case "review":
            return {
                ...basic,
                color: reviewCardsCountColor
            }
    }
}