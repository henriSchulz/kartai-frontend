export class Settings {
    public static PRODUCTION = false
    public static API_HOST = this?.PRODUCTION ? "https://api.kartai.de" : "http://localhost:4000"
    public static LANGUAGE = "de"
    public static REDUCE_ANIMATIONS = false
    public static CARD_FLIP_TRANSITION_DURATION = 800


}