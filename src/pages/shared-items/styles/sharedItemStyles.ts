import {SxProps} from "@mui/system";
import {Theme} from "@mui/material";

export const sharedItemTitle: SxProps<Theme> = {
    fontSize: {xs: "1.2rem"},
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "inline-block",
    maxWidth: {lg: 500, xl: 500, md: 500, sm: 350, xs: 170}
}