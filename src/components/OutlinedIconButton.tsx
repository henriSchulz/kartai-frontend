import {IconButton, IconButtonProps} from "@mui/material";
import {theme} from "../styles/theme";


export default function (props: IconButtonProps) {
    const {sx, ...otherProps} = props

    return <IconButton sx={{
        color: theme.palette.primary.main,
        border: "1px solid #E4EAF2",
        borderRadius: "12px",
        p: 1,
        "&:hover": {
            backgroundColor: "#F4F6F9",
            borderColor: "#C7D0DD"
        },
        ...sx
    }} {...otherProps}>{props.children}</IconButton>
}