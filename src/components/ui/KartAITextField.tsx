import {TextField, Theme} from "@mui/material";
import {SxProps} from "@mui/system";
import {box} from "../../styles/box";

interface KartAITextFieldProps {
    onChange?: (value: string) => void
    value?: string
    label: string
    size?: "small" | "medium"
    fullWidth?: boolean
    multiline?: boolean
    rows?: number
    variant: "standard" | "filled" | "outlined"
    id?: string
    disabled?: boolean
    defaultValue?: string
    sx?: SxProps<Theme>
    mt?: number
    mb?: number
    ml?: number
    mr?: number
    autoFocus?: boolean
    type?: "text" | "password" | "email" | "number"
}

export default function KartAITextField(props: KartAITextFieldProps) {

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

    return <TextField
        sx={getSx()}
        disabled={props.disabled}
        variant={props.variant}
        autoFocus={props.autoFocus}
        defaultValue={props.defaultValue}
        type={props.type}
        onChange={e => {
            if (props.onChange) {
                props.onChange(e.target.value)
            }
        }}
        id={props.id}
        value={props.value}
        label={props.label}
        size={props.size}
        fullWidth={props.fullWidth}
        multiline={props.multiline}
        rows={props.rows}
    />
}