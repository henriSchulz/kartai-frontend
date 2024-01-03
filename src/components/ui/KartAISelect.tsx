import React from 'react'
import {Box, Divider, FormControl, InputLabel, MenuItem, Select, Theme, Typography} from "@mui/material";
import {SxProps} from "@mui/system";

interface KartAISelectProps {
    value: string
    onChange?: (value: string) => void
    options: { label: string, value: string }[]
    label?: string
    action?: { onClick: () => void, text: string, icon: React.ReactNode }
    variant?: "standard" | "filled" | "outlined"
    fullWidth?: boolean
    disabled?: boolean
    sx?: SxProps<Theme>
    mt?: number
    mb?: number
    ml?: number
    mr?: number
    size?: "small" | "medium"
}

export default function (props: KartAISelectProps) {


    const getSx = () => {
        let sx: SxProps<Theme> = {
            ...(props.sx ?? {})
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

        return sx
    }

    return <FormControl size={props.size} sx={getSx()} fullWidth={props.fullWidth}>
        {props.label && <InputLabel>{props.label}</InputLabel>}
        <Select disabled={props.disabled}
                fullWidth={props.fullWidth}
                variant={props.variant}
                value={props.value}
                label={props.label}
                onChange={e => {
                    if (props.onChange) props.onChange(e.target.value as string)
                }}>
            {props.options.map((option, index) => <MenuItem key={index}
                                                            value={option.value}>{option.label}</MenuItem>)}
            {props.action && <div>
                <Divider/>
                <MenuItem onClick={props.action.onClick}>
                    {props.action.icon}
                    <Typography sx={{ml: 1}}>{props.action.text}</Typography>
                </MenuItem>
            </div>}

        </Select>
    </FormControl>
}