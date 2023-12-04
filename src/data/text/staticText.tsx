import axios from "axios";

import {Box, Theme} from "@mui/material";
import {SxProps} from "@mui/system";
import {StaticTextKeys} from "./StaticTextKeys";
import de from "./langs/de"

const LANGUAGE = "de"


const LANGUAGES = {
    de
}

export const StaticText: StaticTextKeys = {
    ...LANGUAGES[LANGUAGE]
}





