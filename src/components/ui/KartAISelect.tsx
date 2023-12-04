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
}

export default function (props: KartAISelectProps) {
    return <FormControl sx={props.sx} fullWidth={props.fullWidth}>
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