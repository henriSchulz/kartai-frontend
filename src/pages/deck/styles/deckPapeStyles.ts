import {SxProps} from "@mui/system";
import {Theme} from "@mui/material";
import {learnCardsCountColor, loadingGray, newCardsCountColor, reviewCardsCountColor} from "../../../styles/root";

export function deckPageCardsCount(cardLevel: "new" | "learning" | "review", noCards: boolean): SxProps<Theme> {
    const basic: SxProps<Theme> = {
        fontSize: 25,
        ml: 3,
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


export const deckPageStudyButton = {
    ml: {
        xl: 10, lg: 10, md: 10, sm: 5, xs: 2
    },
    alignSelf: "center",
    fontSize: 23
}

export const deckFinishedText = {
    fontSize: {lg: 28, md: 25, sm: 20, xs: 20},
    marginTop: "30px",
    marginBottom: "30px",
    fontWeight: "500"
}