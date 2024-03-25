import {SxProps} from "@mui/system";
import {Box, Breakpoint, Theme} from "@mui/material";
import React from "react";
import {box} from "../../styles/box";
import {isXsWindow} from "../../utils/general";

interface KartAIBoxProps {
    sx?: SxProps<Theme>

    children?: React.ReactNode

    styled?: boolean

    flexCenter?: boolean

    flexStart?: boolean

    gridCenter?: boolean

    gridStart?: boolean

    flexSpaceBetween?: boolean

    className?: string

    mt?: number
    mb?: number
    ml?: number
    mr?: number

    fullWidth?: boolean

    onClick?(event: React.MouseEvent<HTMLElement>): void

    onContextMenu?(event: React.MouseEvent<HTMLDivElement>): void

    onDoubleClick?(): void

    key?: string | number

    id?: string

    hide?: boolean

    hideIfXs?: boolean

    spacing?: number

    htmlString?: string

    halfWidth?: boolean

    component?: React.ElementType
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

        if (props.fullWidth) {
            sx = {...sx, width: "100%"}
        }

        if (props.flexStart) {
            sx = {...sx, display: "flex", justifyContent: "flex-start", alignItems: "center"}
        }

        if (props.spacing) {
            sx = {...sx, gap: props.spacing}
        }

        if (props.halfWidth) {
            sx = {...sx, width: "50%"}
        }

        return sx
    }


    if (props.hideIfXs && isXsWindow()) return <></>

    if (props.hide) return <></>

    if (props.htmlString) return <Box
        id={props.id} onDoubleClick={props.onDoubleClick}
        onContextMenu={props.onContextMenu}
        onClick={props.onClick}
        sx={getSx()}
        dangerouslySetInnerHTML={{__html: props.htmlString}}/>

    return <Box component={props.component} className={props.className}
                id={props.id} onDoubleClick={props.onDoubleClick}
                onContextMenu={props.onContextMenu}
                onClick={props.onClick}
                sx={getSx()}>
        {props.children}
    </Box>
}