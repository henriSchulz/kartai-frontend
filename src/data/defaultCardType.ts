import CardType from "../types/dbmodel/CardType";
import {StaticText} from "./text/staticText";
import Field from "../types/dbmodel/Field";
import CardTypeVariantUtils from "../utils/CardTypeVariantUtils";
import CardTypeVariant from "../types/dbmodel/CardTypeVariant";


namespace defaultCardType {
    export const defaultCardType: CardType = {
        id: "default-card-type",
        name: StaticText.DEFAULT_CARD_TYPE_NAME,
    }

    export const defaultFieldFront: Field = {
        id: "default-field-front",
        name: StaticText.FRONT,
        cardTypeId: defaultCardType.id,
    }

    export const defaultFieldBack: Field = {
        id: "default-field-back",
        name: StaticText.BACK,
        cardTypeId: defaultCardType.id,
    }

    export const defaultCardTypeVariant: CardTypeVariant = {
        id: "default-card-type-variant",
        name: StaticText.CARD + " 1",
        cardTypeId: defaultCardType.id,
        templateFront: "{{" + defaultFieldFront.name + "}}",
        templateBack: "{{" + defaultFieldBack.name + "}}",
    }
}


export default defaultCardType



