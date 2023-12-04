import {TextField} from "@mui/material";

interface KartAITextFieldProps {
    onChange?: (value: string) => void
    value?: string
    label: string
    size: "small" | "medium"
    fullWidth?: boolean
    multiline?: boolean
    rows?: number
    variant: "standard" | "filled" | "outlined"
    id: string
    disabled?: boolean
    defaultValue?: string
}

export default function KartAITextField(props: KartAITextFieldProps) {
    return <TextField
        disabled={props.disabled}
        variant={props.variant}
        defaultValue={props.defaultValue}
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