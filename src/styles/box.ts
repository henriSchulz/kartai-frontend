import {SxProps} from "@mui/system";
import {lightBorderColor} from "./root";
import {Theme} from "@mui/material";


export const box: SxProps<Theme> = {
    color: "#1C2025",
    backgroundImage: "linear-gradient(to right top, rgba(240, 247, 255, 0.3) 40%, rgba(243, 246, 249, 0.2) 100%)",
    border: "1px solid " + lightBorderColor,
    borderRadius: "12px",
    overflowY: "scroll",
    overflowX: "hidden",
    py: 2,
    px: 4
}