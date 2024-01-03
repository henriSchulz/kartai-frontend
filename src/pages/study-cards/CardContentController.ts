import FieldContentPair from "../../types/FieldContentPair";
import {getWindowWidth} from "../../utils/general";
import {StaticText} from "../../data/text/staticText";
import {Svg} from "../../asserts/asserts";

interface CardContentControllerOptions {
    fieldContentPairs: FieldContentPair[]
    templateFront: string
    templateBack: string
    backHidden: boolean
}


export default class CardContentController {

    private readonly fieldContentPairs: FieldContentPair[]
    private readonly templateFront: string
    private readonly templateBack: string
    private readonly backHidden: boolean

    constructor(options: CardContentControllerOptions) {
        this.fieldContentPairs = options.fieldContentPairs
        this.templateFront = options.templateFront
        this.templateBack = options.templateBack
        this.backHidden = options.backHidden
    }

    private replaceBasicFields = (fieldContentPairs: FieldContentPair[], template: string): string => {
        let result = template
        for (let i = 0; i < fieldContentPairs.length; i++) {
            const fieldContentPair = fieldContentPairs[i]
            const fieldContent = fieldContentPair.fieldContent
            if (!fieldContent) {
                console.error("fieldContent is undefined", fieldContentPair)
                continue
            }
            result = result.replaceAll(`{{${fieldContentPair.field.name}}}`, fieldContent.content)
        }
        return result
    }

    private replaceTypeFields = (fieldContentPairs: FieldContentPair[], template: string): string => {
        let result = template
        for (let i = 0; i < fieldContentPairs.length; i++) {
            const fieldContentPair = fieldContentPairs[i]
            const fieldContent = fieldContentPair.fieldContent
            if (!fieldContent) {
                console.error("fieldContent is undefined", fieldContentPair)
                continue
            }

            if (this.backHidden) {
                const replacement = `<input id="typeAnswerField" placeholder="${StaticText.ENTER_ANSWER}..." class="type-answer-input">`
                result = result.replaceAll(`{{type:${fieldContentPair.field.name}}}`, replacement)
            } else {
                const typedValue = window.tempInputValue ?? "";
                const correctValue = fieldContent.content;

                let evaluatedAnswer = "<div style='margin: 2px'>";

                for (let i = 0; i < typedValue.length; i++) {
                    const typedLetter = typedValue[i];
                    const correctLetter = correctValue[i];

                    if (typedLetter === correctLetter) {
                        evaluatedAnswer += `<span class="approved-bg">${typedLetter}</span>`;
                    } else {
                        evaluatedAnswer += `<span class="denied-bg">${typedLetter}</span>`;
                    }
                }

                evaluatedAnswer += "</div>"


                const replacement = typedValue === correctValue ?
                    `<span style="margin: 2px" class="approved-bg">${correctValue}</span> `
                    : `<div class="type-in-card-answer-container">${evaluatedAnswer}${Svg.ARROW_DOWN}
                              <span style="margin: 2px" class="approved-bg">${correctValue}</span>
                           </div>`
                result = result.replaceAll(`{{type:${fieldContentPair.field.name}}}`, replacement)
            }
        }
        return result
    }


    public getFront = (): string => {
        const replaceMethods = [this.replaceBasicFields, this.replaceTypeFields]
        let result = this.templateFront
        for (const replaceMethod of replaceMethods) {
            result = replaceMethod(this.fieldContentPairs, result)
        }

        return result
    }

    public getBack = (): string => {
        const replaceMethods = [this.replaceBasicFields, this.replaceTypeFields]
        let result = this.templateBack
        for (const replaceMethod of replaceMethods) {
            result = replaceMethod(this.fieldContentPairs, result)
        }
        return result
    }

    private getContentLength = (fieldContentPairs: FieldContentPair[], template: string): number => {
        let result = template
        for (let i = 0; i < fieldContentPairs.length; i++) {
            const fieldContentPair = fieldContentPairs[i]
            const fieldContent = fieldContentPair.fieldContent
            if (!fieldContent) {
                console.error("fieldContent is undefined", fieldContentPair)
                continue
            }
            result = result.replaceAll(`{{${fieldContentPair.field.name}}}`, fieldContent.content)
            result = result.replaceAll(`{{type:${fieldContentPair.field.name}}}`, fieldContent.content)
        }
        return result.length
    }

    public calcFontSize = (): number => {
        const maxFontSize = 45


        const contentLength = this.backHidden ?
            this.getContentLength(this.fieldContentPairs, this.templateFront) :
            this.getContentLength(this.fieldContentPairs, this.templateBack)

        const windowSize = getWindowWidth()
        const windowSizeFactors = {xl: 1, lg: 1, md: 0.9, sm: 0.8, xs: 0.7}
        const contentLengthFactors = {
            0: 1,
            100: 0.9,
            200: 0.8,
            400: 0.6,
            1000: 0.5,
        }


        if (contentLength < 100) {
            return maxFontSize * windowSizeFactors[windowSize] * contentLengthFactors[0]
        }

        if (contentLength < 200) {
            return maxFontSize * windowSizeFactors[windowSize] * contentLengthFactors[100]
        }

        if (contentLength < 400) {
            return maxFontSize * windowSizeFactors[windowSize] * contentLengthFactors[200]
        }

        if (contentLength < 1000) {
            return maxFontSize * windowSizeFactors[windowSize] * contentLengthFactors[400]
        }


        return maxFontSize * windowSizeFactors[windowSize] * contentLengthFactors[1000]


    }

}
