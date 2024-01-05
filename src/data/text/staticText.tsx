import {StaticTextKeys} from "./StaticTextKeys";
import de from "./langs/de"
import Language from "../../types/Language";
import {Settings} from "../../Settings";

const {LANGUAGE} = Settings


export const LANGUAGE_DATA = {
    de,
}

export const StaticText: StaticTextKeys = {
    ...LANGUAGE_DATA[LANGUAGE]
}


export const LANGUAGE_NAMES: Record<Language, string> = {
    de: StaticText.GERMAN,
}





