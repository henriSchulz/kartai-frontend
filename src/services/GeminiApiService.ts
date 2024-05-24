import Card from "../types/dbmodel/Card";
import FieldContent from "../types/dbmodel/FieldContent";
import CardTypeUtils from "../utils/CardTypeUtils";
import FieldUtils from "../utils/FieldUtils";
import {StaticText} from "../data/text/staticText";
import RequestBuilder from "../lib/RequestBuilder";
import {Settings} from "../Settings";
import AuthenticationService from "./AuthenticationService";
import PARTS_DE from "../data/text/langs/ai/parts-de";
import Language from "../types/Language";

export const PARTS: Record<Language, { text: string }[]> = {
    de: PARTS_DE
}


export default class GeminiApiService {
    static async generateCards(cardTypeId: string, deckId: string, inputText: string):
        Promise<{ cards: Card[], fieldContents: FieldContent[] } | null> {

        const cardType = CardTypeUtils.getInstance().getById(cardTypeId)

        const fields = FieldUtils.getInstance().getAllBy("cardTypeId", cardTypeId)

        const prompt = StaticText.GEMINI_CARD_GENERATION_PROMPT
            .replaceAll("{fields}", "[" + fields.map(f => f.name).join(", " + "]"))
            .replaceAll("{cardType}", cardType.name)


        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_HOST}/cards/generate-gemini`,
            method: "POST",
            token: AuthenticationService.current?.token,
            body: {
                prompt,
                inputText,
                deckId,
                cardTypeId,
                parts: PARTS[Settings.LANGUAGE]
            }
        })

        const response = await request.send<{ cards?: Card[], fieldContents?: FieldContent[], error?: string }>()

        if (response.error || !response.data) {
            return null
        }

        if (response.data["error"]) {
            return null
        }
        return response.data as { cards: Card[], fieldContents: FieldContent[] }


    }
}