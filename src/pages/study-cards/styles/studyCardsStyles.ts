import {SxProps} from "@mui/system";
import {Theme} from "@mui/material";
import {theme} from "../../../styles/theme";
import {learnCardsCountColor, loadingGray, newCardsCountColor, reviewCardsCountColor} from "../../../styles/root";

export const cardWidth = {xl: 960, lg: 960, md: 800, sm: 600, xs: 400}


function transformCardWidth(change: number) {
    return {
        xl: cardWidth.xl + change,
        lg: cardWidth.lg + change,
        md: cardWidth.md + change,
        sm: cardWidth.sm + change,
        xs: cardWidth.xs + change
    }
}

export const cardHeight = {
    xl: calcHeight(cardWidth.xl),
    lg: calcHeight(cardWidth.lg),
    md: calcHeight(cardWidth.md),
    sm: calcHeight(cardWidth.sm),
    xs: window.innerHeight - 70
}

export const cardContentHeightCorrection = 140

export const cardContentHeight = {
    xl: cardHeight.xl - cardContentHeightCorrection,
    lg: cardHeight.lg - cardContentHeightCorrection,
    md: cardHeight.md - cardContentHeightCorrection,
    sm: cardHeight.sm - cardContentHeightCorrection,
    xs: window.innerHeight - 70 - cardContentHeightCorrection
}

export const cardsRemainingNum = {
    fontSize: 25,
    color: theme.palette.secondary.main
}

export const cardStyles: SxProps<Theme> = {
    mt: {xl: 5, lg: 3, md: 2, sm: 2, xs: 2},
    p: 5,
    width: cardWidth,
    height: cardHeight,
    overflow: "hidden",
    '@media (max-width: 575px)': {
        boxShadow: 'none',
        border: "none",
        marginTop: 1
    },
};

export function cardContentStyles(fontSize: number, unsetHeight?: boolean): SxProps<Theme> {
    const styles = {
        height: cardContentHeight,
        overflowY: "scroll",
        wordBreak: "break-word",
        textAlign: "center",
        fontSize,
        "& div > hr": {
            width: cardWidth,
            height: "1px",
            borderTop: "none",
        },
        "& #typeAnswerField": {
            width: transformCardWidth(-30),
        }
    }

    if (unsetHeight) {
        const {height, ...rest} = styles
        return rest
    }
    return styles

}

function calcHeight(width: number) {
    return width * (9 / 16)
}

export function studyCardsPageCardsCount(cardLevel: "new" | "learning" | "review", noCards: boolean): SxProps<Theme> {
    const basic: SxProps<Theme> = {
        fontSize: 25,
        mx: 1
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


