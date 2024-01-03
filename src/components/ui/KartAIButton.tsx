import {Button, CircularProgress, SxProps, Theme, Typography,} from "@mui/material";
import React from "react";
import KartAIBox from "./KartAIBox";
import {isXsWindow} from "../../utils/general";
import {StaticText} from "../../data/text/staticText";

interface KartAIButtonProps {
    variant: "contained" | "outlined" | "text"
    children: React.ReactNode | string
    loading?: boolean
    fullWidth?: boolean
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning"
    disabled?: boolean
    size?: "small" | "medium" | "large"
    loadingText?: string

    onClick?(event: React.MouseEvent<HTMLElement>): void

    sx?: SxProps<Theme>
    startIcon?: React.ReactNode

    mt?: number
    mb?: number
    ml?: number
    mr?: number
    hideIfXs?: boolean
}


const KartAIButton = React.forwardRef((props: KartAIButtonProps, ref: React.Ref<any>) => {

    const getSx = () => {
        let sx: SxProps<Theme> = {...props.sx}

        if (props.fullWidth) {
            sx = {...sx, width: "100%"}
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

    if (props.hideIfXs && isXsWindow()) {
        return <></>
    }


    return <Button ref={ref} startIcon={props.startIcon} sx={getSx()} onClick={props.onClick} size={props.size}
                   color={props.color}
                   disabled={props.disabled || props.loading}
                   fullWidth={props.fullWidth} variant={props.variant}>
        {props.loading ? <KartAIBox spacing={1} flexCenter>
            <Typography>{props.loadingText ?? StaticText.LOADING}</Typography>
            <CircularProgress size="1.5rem"/>
        </KartAIBox> : props.children}
    </Button>
})

export default KartAIButton
