import CardType from "../types/dbmodel/CardType";
import {StaticText} from "./text/staticText";
import Field from "../types/dbmodel/Field";
import CardTypeVariant from "../types/dbmodel/CardTypeVariant";
import FieldContentPair from "../types/FieldContentPair";
import FieldUtils from "../utils/FieldUtils";
import CardTypeUtils from "../utils/CardTypeUtils";
import CardTypeVariantUtils from "../utils/CardTypeVariantUtils";
import {generateModelId, ID_PROPERTIES} from "../utils/general";


export function createSampleFieldContentPairs(cardTypeId: string): FieldContentPair[] {
    const fields = FieldUtils.getInstance().getAllBy("cardTypeId", cardTypeId)
    return fields.map(f => {
        return {
            field: f,
            fieldContent: {
                id: "",
                content: f.name + " content",
                cardId: "",
                fieldId: "",
            }
        }
    })
}

const DEFAULT_CARD_TYPE_PREFIXES = ["dct1", "dct2", "dct3"]


class DefaultCardType {
    static getCardType(): CardType {
        return {
            id: "dct1-" + generateModelId(ID_PROPERTIES.length - 5),
            name: StaticText.DEFAULT_CARD_TYPE_NAME,
        }
    }

    static getFieldFront(cardTypeId: string): Field {
        return {
            id: "df1-" + generateModelId(ID_PROPERTIES.length - 6),
            name: StaticText.FRONT,
            cardTypeId: cardTypeId,
        }
    }

    static getFieldBack(cardTypeId: string): Field {
        return {
            id: "df2-" + generateModelId(ID_PROPERTIES.length - 6),
            name: StaticText.BACK,
            cardTypeId: cardTypeId,
        }
    }

    static getCardTypeVariant(cardTypeId: string): CardTypeVariant {
        return {
            id: "dctv1-" + generateModelId(ID_PROPERTIES.length - 7),
            name: StaticText.CARD + " 1",
            cardTypeId: cardTypeId,
            templateFront: "{{" + this.getFieldFront(cardTypeId).name + "}}",
            templateBack: "{{" + this.getFieldFront(cardTypeId).name + "}}<hr>{{" + this.getFieldBack(cardTypeId).name + "}}",
        }
    }

    static async addIfNotExists() {
        if (CardTypeUtils.getInstance().hasDefaultCardType("dct1")) return
        const defaultCardType = DefaultCardType.getCardType()
        const defaultFieldFront = DefaultCardType.getFieldFront(defaultCardType.id)
        const defaultFieldBack = DefaultCardType.getFieldBack(defaultCardType.id)
        const defaultCardTypeVariant = DefaultCardType.getCardTypeVariant(defaultCardType.id)
        await CardTypeUtils.getInstance().add(defaultCardType)
        await FieldUtils.getInstance().add([defaultFieldFront, defaultFieldBack])
        await CardTypeVariantUtils.getInstance().add(defaultCardTypeVariant)
    }

}

export class DefaultTextFieldCardType {
    static getCardType(): CardType {
        return {
            id: "dct2-" + generateModelId(ID_PROPERTIES.length - 5),
            name: StaticText.DEFAULT_TEXTFIELD_CARD_TYPE_NAME,
        }
    }

    static getFieldFront(cardTypeId: string): Field {
        return {
            id: "df3-" + generateModelId(ID_PROPERTIES.length - 6),
            name: StaticText.FRONT,
            cardTypeId: cardTypeId,
        }
    }

    static getFieldBack(cardTypeId: string): Field {
        return {
            id: "df4-" + generateModelId(ID_PROPERTIES.length - 6),
            name: StaticText.BACK,
            cardTypeId: cardTypeId,
        }
    }

    static getCardTypeVariant(cardTypeId: string): CardTypeVariant {
        return {
            id: "dctv2-" + generateModelId(ID_PROPERTIES.length - 7),
            name: StaticText.CARD + " 1",
            cardTypeId: cardTypeId,
            templateFront: "{{" + this.getFieldFront(cardTypeId).name + "}}<hr>{{type:" + this.getFieldBack(cardTypeId).name + "}}",
            templateBack: "{{" + this.getFieldFront(cardTypeId).name + "}}<hr>{{type:" + this.getFieldBack(cardTypeId).name + "}}",
        }
    }

    static async addIfNotExists() {
        if (CardTypeUtils.getInstance().hasDefaultCardType("dct2")) return
        const defaultCardType = DefaultTextFieldCardType.getCardType()
        const defaultFieldFront = DefaultTextFieldCardType.getFieldFront(defaultCardType.id)
        const defaultFieldBack = DefaultTextFieldCardType.getFieldBack(defaultCardType.id)
        const defaultCardTypeVariant = DefaultTextFieldCardType.getCardTypeVariant(defaultCardType.id)
        await CardTypeUtils.getInstance().add(defaultCardType)
        await FieldUtils.getInstance().add([defaultFieldFront, defaultFieldBack])
        await CardTypeVariantUtils.getInstance().add(defaultCardTypeVariant)
    }


}

export class DefaultBothDirectionsCardType {
    static getCardType(): CardType {
        return {
            id: "dct3-" + generateModelId(ID_PROPERTIES.length - 5),
            name: StaticText.SIMPLE_BOTH_DIRECTIONS,
        }
    }

    static getFieldFront(cardTypeId: string): Field {
        return {
            id: "df5-" + generateModelId(ID_PROPERTIES.length - 6),
            name: StaticText.FRONT,
            cardTypeId: cardTypeId,
        }
    }

    static getFieldBack(cardTypeId: string): Field {
        return {
            id: "df6-" + generateModelId(ID_PROPERTIES.length - 6),
            name: StaticText.BACK,
            cardTypeId: cardTypeId,
        }
    }

    static getCardTypeVariant(cardTypeId: string): CardTypeVariant {
        return {
            id: "dctv3-" + generateModelId(ID_PROPERTIES.length - 7),
            name: StaticText.CARD + " 1",
            cardTypeId: cardTypeId,
            templateFront: "{{" + this.getFieldFront(cardTypeId).name + "}}",
            templateBack: "{{" + this.getFieldFront(cardTypeId).name + "}}<hr>{{" + this.getFieldBack(cardTypeId).name + "}}",
        }
    }

    static getCardTypeVariant2(cardTypeId: string): CardTypeVariant {
        return {
            id: "dctv4-" + generateModelId(ID_PROPERTIES.length - 7),
            name: StaticText.CARD + " 2",
            cardTypeId: cardTypeId,
            templateFront: "{{" + this.getFieldBack(cardTypeId).name + "}}",
            templateBack: "{{" + this.getFieldBack(cardTypeId).name + "}}<hr>{{" + this.getFieldFront(cardTypeId).name + "}}",
        }
    }

    static async addIfNotExists() {
        if (CardTypeUtils.getInstance().hasDefaultCardType("dct3")) return
        const defaultCardType = DefaultBothDirectionsCardType.getCardType()
        const defaultFieldFront = DefaultBothDirectionsCardType.getFieldFront(defaultCardType.id)
        const defaultFieldBack = DefaultBothDirectionsCardType.getFieldBack(defaultCardType.id)
        const defaultCardTypeVariant = DefaultBothDirectionsCardType.getCardTypeVariant(defaultCardType.id)
        const defaultCardTypeVariant2 = DefaultBothDirectionsCardType.getCardTypeVariant2(defaultCardType.id)
        await CardTypeUtils.getInstance().add(defaultCardType)
        await FieldUtils.getInstance().add([defaultFieldFront, defaultFieldBack])
        await CardTypeVariantUtils.getInstance().add([defaultCardTypeVariant, defaultCardTypeVariant2])
    }
}


export function isDefaultCardType(cardType: CardType): boolean {
    for (const defaultCardTypesPrefix of DEFAULT_CARD_TYPE_PREFIXES) {
        if (cardType.id.startsWith(defaultCardTypesPrefix)) return true
    }
    return false
}

export default DefaultCardType



