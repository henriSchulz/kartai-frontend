import {Settings} from "../Settings";
import RequestBuilder from "../lib/RequestBuilder";
import AuthenticationService from "./AuthenticationService";
import Card from "../types/dbmodel/Card";
import FieldContent from "../types/dbmodel/FieldContent";
import CardUtils from "../utils/CardUtils";
import FieldContentUtils from "../utils/FieldContentUtils";
import FieldUtils from "../utils/FieldUtils";
import {StaticText} from "../data/text/staticText";
import CardTypeUtils from "../utils/CardTypeUtils";

interface OpenaiApiServiceOptions {
    role: string,
    messages: any[]
}

export default class OpenaiApiService {
    static async sendLangModelRequest(options: OpenaiApiServiceOptions) {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "post", body: JSON.stringify({
                    model: Settings.GPT_VERSION,
                    messages: [...options.messages, {role: "system", content: options.role}],

                }), headers: {
                    "Content-Type": "application/json", "Authorization": "Bearer " + Settings.OPENAI_KEY
                }
            });
            return await response.json()
        } catch (e: any) {
            throw new Error("OpenAI request failed: " + e.message)
        }
    }

    static async isValidOpenAIAPIKey(key: string): Promise<boolean> {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "post",
                headers: {
                    "Content-Type": "application/json", "Authorization": "Bearer " + key
                }
            });

            return response.status !== 401
        } catch (e: any) {
            return false
        }
    }

    private static generateFormatExampleArray(fieldNames: string[]): string {
        let result: string[][] = [];
        for (let i = 1; i <= 3; i++) {
            let subArray: string[] = [];
            for (const fieldName of fieldNames) {
                subArray.push(fieldName);
            }


            result.push(subArray);
        }

        return JSON.stringify(result);
    }

    static async generateCards(cardTypeId: string,deckId: string ,inputText: string):
        Promise<{ cards: Card[], fieldContents: FieldContent[] } | null> {

        const cardType = CardTypeUtils.getInstance().getById(cardTypeId)

        const fields = FieldUtils.getInstance().getAllBy("cardTypeId", cardTypeId)

        const jsonEg = this.generateFormatExampleArray(fields.map(field => field.name))

        const prompt = StaticText.CARD_GENERATION_PROMPT
            .replaceAll("{eg}", jsonEg)
            .replaceAll("{cardType}", cardType.name)


        const request = RequestBuilder.buildRequest({
            url: `${Settings.API_HOST}/cards/generate`,
            method: "POST",
            token: AuthenticationService.current?.token,
            body: {
                prompt,
                inputText,
                deckId,
                cardTypeId,
                openAIKey: Settings.OPENAI_KEY,
                gptVersion: Settings.GPT_VERSION
            }
        })

        const response = await request.send<{ cards?: Card[], fieldContents?: FieldContent[], error?: string }>()

        if (response.error || !response.data) {
            return null
        }

        if (response.data["error"]) {
            return null
        }
        return response.data as { cards: Card[], fieldContents: FieldContent[]}


    }
}