import {Typography} from "@mui/material";
import {kartAIInfoText} from "../../styles/typography";

export default function ({text, show}: { text: string, show: boolean }) {
    if (!show) return <></>
    return <Typography sx={kartAIInfoText} component="h4">
        {text}
    </Typography>
}