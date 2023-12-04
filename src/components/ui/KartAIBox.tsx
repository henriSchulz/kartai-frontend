import {SxProps} from "@mui/system";
import {Box, Breakpoint, Theme} from "@mui/material";
import React from "react";
import {box} from "../../styles/box";

interface KartAIBoxProps {
    sx?: SxProps<Theme>

    children?: React.ReactNode

    styled?: boolean

    flexCenter?: boolean

    gridCenter?: boolean

    gridStart?: boolean

    flexSpaceBetween?: boolean

    mt?: number
    mb?: number
    ml?: number
    mr?: number

    onClick?(event: React.MouseEvent<HTMLElement>): void

    onContextMenu?(event: React.MouseEvent<HTMLDivElement>): void

    onDoubleClick?(): void

    key?: string | number
}

export default function (props: KartAIBoxProps) {
    const getSx = () => {
        let sx: SxProps<Theme> = {
            ...(props.sx ?? {})
        }

        if (props.styled) {
            sx = {...sx, ...(box as object)}
        }

        if (props.flexCenter) {
            sx = {...sx, display: "flex", justifyContent: "center", alignItems: "center"}
        }

        if (props.gridCenter) {
            sx = {...sx, display: "grid", placeItems: "center"}
        }

        if (props.gridStart) {
            sx = {...sx, display: "grid", placeItems: "start"}
        }

        if (props.flexSpaceBetween) {
            sx = {...sx, display: "flex", justifyContent: "space-between", alignItems: "center"}
        }

        if (props.mt) {
            sx = {...sx, mt: props.mt}
        }
        if (props.mb) {
            sx = {...sx, mb: props.mb}
        }
        if (props.ml) {
            sx = {...sx, ml: props.ml}
        }
        if (props.mr) {
            sx = {...sx, mr: props.mr}
        }

        return sx
    }


    return <Box onDoubleClick={props.onDoubleClick} onContextMenu={props.onContextMenu} onClick={props.onClick}
                sx={getSx()}>
        {props.children}
    </Box>
}