import {Theme} from "@mui/material";
import {SxProps} from "@mui/system";
import {darkTextColor, defaultBackgroundGradient, lightBorderColor} from "./root";
import {teal} from "@mui/material/colors";


export const listViewWidth = {md: 800, sm: 700, xs: 390}
export const listViewHeight = {md: 550, sm: 450, xs: window.innerHeight-100}

export const listView: SxProps<Theme> = {
    borderRadius: "8px",
    outline: "10px solid transparent",
    border: "1px solid",
    borderColor: {xs: "white", md: lightBorderColor},
    width: listViewWidth,
    height: listViewHeight,
    overflowY: "scroll",
    overflowX: "hidden",
    p: 5,
}

export const listViewHeader: SxProps<Theme> = {
    width: "100%",
    mb: 1,
    mt: -1,
}

export const listViewContentFullHeight: SxProps<Theme> = {
    overflowY: "scroll",
    height: "100%"
}

export const listViewContent: SxProps<Theme> = {
    overflowY: "scroll",
    overflowX: "hidden",
    height: {md: 400, xs: window.innerHeight-200},
    pt: 2
}

export function row(selected: boolean): SxProps<Theme> {
    return {
        color: darkTextColor,
        backgroundImage: defaultBackgroundGradient,
        borderRadius: "12px",
        border: selected ? "1px solid #21658F" : "1px solid" + lightBorderColor,
        backgroundColor: selected ? teal[50] : "unset",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        padding: "6px 20px",
        alignItems: "center",
        userSelect: "none",
        transition: "border 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        transitionDuration: "150ms, 150ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: "0ms, 0ms",
        transitionProperty: "border, box-shadow",
        "&:hover": {
            border: "1px solid #21658F",
            backgroundImage: "none"
        }
    }
}
