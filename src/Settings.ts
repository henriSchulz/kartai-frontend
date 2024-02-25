import Language from "./types/Language";
import {LocalStorageKeys} from "./data/LocalStorageKeys";


const LANGUAGES: Language[] = ["de"]


export class Settings {

    private static getLanguage(): Language {
        const language = localStorage.getItem(LocalStorageKeys.LANGUAGE) ?? "de"

        if (Object.keys(LANGUAGES).includes(language)) return language as Language

        return "de"
    }

    public static PRODUCTION = process.env.REACT_APP_NODE_ENV === "production"
    public static ALLOWS_COOKIES = Boolean(Number(localStorage.getItem(LocalStorageKeys.ALLOWS_COOKIES)))
    public static API_HOST = this?.PRODUCTION ? "https://api.kartai.de" : "http://localhost:4000"
    public static LANGUAGE: Language = this.getLanguage()
    public static REDUCE_ANIMATIONS = false
    public static CARD_FLIP_TRANSITION_DURATION = 350
    public static OPENAI_KEY = localStorage.getItem(LocalStorageKeys.OPENAI_KEY) ?? ""
    public static GPT_VERSION = localStorage.getItem(LocalStorageKeys.GPT_VERSION) ?? "gpt-3.5-turbo"
    public static PRIVACY_POLICY_LINK = "https://www.craft.me/s/bTUA5b0lpyHVy5"
    public static LEGAL_NOTICE_LINK = "about:blank"
    // @ts-ignore
    public static IS_ELECTRON = Boolean(window && window.process && window.process.type === "renderer")
}


export class Limits {
    public static IMPORT_LIMIT = 2000
    public static DECK_SIZE_LIMIT = 2000
}


