import FieldContentPair from "../../types/FieldContentPair";
import {getWindowWidth} from "../../utils/general";
import {StaticText} from "../../data/text/staticText";
import {Svg} from "../../assets/asserts";
import {renderToStaticMarkup, renderToString} from "react-dom/server";
import katex from "katex";
import Latex from "react-latex";


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
            result = result.replaceAll(`{{${fieldContentPair.field.name}}}`, this.replaceLatex(fieldContent.content))
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

    private replaceImageTemplates = (text: string): string => {
        const pattern: RegExp = /\{{img:(.*?)\}}/g;
        const matches: RegExpMatchArray | null = text.match(pattern);

        let tmp = text


        if (matches) {
            try {
                for (const match of matches) {

                    const url = match.split("{{img:")[1].replaceAll("}", "")
                    console.log(url)
                    tmp = tmp.replaceAll(match, `<img class="card-image-size" src="${url}" />`);
                }
            } catch (e) {
                //pass if the image cannot be loaded or parsed
            }
        }

        return tmp
    }

    private replaceLineBreaks = (text: string): string => {


        let result = ""

        for (const line of text.split("\n")) {
            if (!line.startsWith("<") &&
                !line.startsWith("```") &&
                !line.startsWith("{{")
            ) {
                result += line + "<br>"
            } else {
                result += line
                if (line.startsWith("<span>")) result += "<br>"

            }
        }


        return result
    }

    private replaceMarkdownBolt = (text: string): string => {
        // if anything is wrapped in **text**, it will be bold <strong>text</strong>
        const pattern: RegExp = /\*\*([^*]+)\*\*/g;

        return text.replaceAll(pattern, "<strong>$1</strong>")
    }

    private replaceMarkdownItalic = (text: string): string => {
        // if anything is wrapped in *text*, it will be italic <em>text</em>
        const pattern: RegExp = /\*([^*]+)\*/g;

        return text.replaceAll(pattern, "<em>$1</em>")
    }

    private replaceMarkdownBoltItalic = (text: string): string => {
        // if anything is wrapped in ***text***, it will be bold and italic <strong><em>text</em></strong>
        const pattern: RegExp = /\*\*\*(.*)\*\*\*/g;

        return text.replaceAll(pattern, "<strong><em>$1</em></strong>")
    }

    private replaceMarkdownHeaders = (text: string): string => {
        const pattern: RegExp = /#{1,6}\s*(.*)/g;

        return text.replaceAll(pattern, (match, group) => {
            const headerLevel = match.split(" ")[0].length;

            return `<h${headerLevel}>${group}</h${headerLevel}>`
        })
    }

    private replaceMarkdownLists = (text: string): string => {
        const pattern: RegExp = /- (.*)/g;

        return text.replaceAll(pattern, (match, group) => {
            return `<li>${group}</li>`
        })
    }

    private replaceMarkdownCodeBlocks = (text: string): string => {
        const pattern: RegExp = /```([^`]+)```/g;
        console.log(text.match(pattern))
        return text.replaceAll(pattern, '<br><code>$1</code><br>');
    }

    private replaceMarkdownMark = (text: string): string => {
        // if anything is wrapped in `text` only one no more, it will be marked <mark>text</mark>
        const pattern: RegExp = /`([^*]+)`/g;


        return text.replaceAll(pattern, '<span class="mark">$1</span>');
    }

    private replaceLatex = (text: string): string => {

        if (this.isTypeCard()) return text


        // return renderToString(
        //     <Latex strict>
        //         {text}
        //     </Latex>
        // )

        let result = text
        const pattern: RegExp = /\$(.*?)\$/g;

        //extract the latex code, without the $ signs
        const matches: RegExpMatchArray | null = text.match(pattern);

        if (matches) {
            // @ts-ignore
            for (const match of matches) {
                const code = match.split("$")[1];


                const html = katex.renderToString(code, {
                    // throwOnError: false,
                    strict: true,
                    throwOnError: true,
                    displayMode: true

                })

                // const latexUrl = `https://latex.codecogs.com/svg.latex?${code}`
                result = result.replaceAll(match, html);
            }

        }

        return result

    }


    private replaceMarkdown = (text: string): string => {
        if (this.isTypeCard()) return text

        let result = text
        result = this.replaceMarkdownHeaders(result)
        result = this.replaceMarkdownLists(result)
        result = this.replaceLineBreaks(result)
        result = this.replaceMarkdownBoltItalic(result)
        result = this.replaceMarkdownBolt(result)
        result = this.replaceMarkdownItalic(result)

        result = this.replaceMarkdownMark(result)


        return result
    }


    public isTypeCard = () => {
        return this.templateFront.includes("{{type:")
    }


    public getCardContent = (template: "front" | "back") => {
        let result;
        if (template === "front") {
            result = this.templateFront
        } else {
            result = this.templateBack
        }
        const replaceFieldMethods = [this.replaceBasicFields, this.replaceTypeFields]
        const replaceMethods = [this.replaceImageTemplates,
            this.replaceMarkdown
        ]

        for (const replaceMethod of replaceFieldMethods) {
            result = replaceMethod(this.fieldContentPairs, result)
        }
        for (const replaceMethod of replaceMethods) {
            result = replaceMethod(result)
        }

        return result
    }

    public getFront = (): string => {
        return this.getCardContent("front")
    }

    public getBack = (): string => {
        return this.getCardContent("back")
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
        const maxFontSize = 40


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
