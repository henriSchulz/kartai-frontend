import {Button, CircularProgress, SxProps, Theme, Typography,} from "@mui/material";
import React from "react";

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
}


const KartAIButton = React.forwardRef((props: KartAIButtonProps, ref: React.Ref<any>) => {

    const getSx = () => {
        let sx: SxProps<Theme> = {...props.sx}

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


    return <Button ref={ref} startIcon={props.startIcon} sx={getSx()} onClick={props.onClick} size={props.size}
                   color={props.color}
                   disabled={props.disabled || props.loading}
                   fullWidth={props.fullWidth} variant={props.variant}>
        {props.loading ? <>
            <Typography>{props.loadingText}</Typography>
            <CircularProgress size="sm"/>
        </> : props.children}
    </Button>
})

export default KartAIButton
