import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardTypesController from "../../CardTypesController";
import State from "../../../../types/State";
import CardType from "../../../../types/dbmodel/CardType";
import CardTypeVariantUtils from "../../../../utils/CardTypeVariantUtils";
import CardTypeVariant from "../../../../types/dbmodel/CardTypeVariant";
import {StaticText} from "../../../../data/text/staticText";

interface EditCardTypeTemplateControllerOptions extends ModalControllerOptions {
    cardTypesController: CardTypesController
    states: {
        showState: State<boolean>
        selectedCardTypeVariantIdState: State<string>
        currentTemplateState: State<"front" | "back">
        templateFrontState: State<string>
        templateBackState: State<string>
        tempSelectedCardTypeVariantState: State<CardTypeVariant | null>
    }
}


export default class EditCardTypeTemplateController extends ModalController<EditCardTypeTemplateControllerOptions> {

    public cardTypesController: CardTypesController;

    constructor(options: EditCardTypeTemplateControllerOptions) {
        super(options);
        this.cardTypesController = options.cardTypesController;

    }

    public getVariantDescription = (variant: CardTypeVariant) => {
        if (!this.cardTypesController.states.tempSelectedCardTypeState.val) return ""
        const fieldsFront = CardTypeVariantUtils.getFieldsInTemplate(this.cardTypesController.states.tempSelectedCardTypeState.val!, variant.templateFront)
        const fieldsBack = CardTypeVariantUtils.getFieldsInTemplate(this.cardTypesController.states.tempSelectedCardTypeState.val!, variant.templateBack)
        return variant.name + ": " + fieldsFront.map(f => f.name).join("+") + " → " + fieldsBack.map(f => f.name).join("+")
    }

    public open = (cardType?: CardType) => {
        this.cardTypesController.selectTempCardType(cardType!)
        this.setDefaultCardTypeVariant(cardType!)
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        const cardTypeVariant = CardTypeVariantUtils.getInstance().getById(this.states.selectedCardTypeVariantIdState.val!)

        const templateFront = this.states.templateFrontState.val!
        const templateBack = this.states.templateBackState.val!

        if (templateFront === "" || templateFront.replaceAll(" ", "") === "") {
            return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
        }

        if (templateBack === "" || templateBack.replaceAll(" ", "") === "") {
            return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
        }

        const limit = CardTypeVariantUtils.getInstance().storeSchema.templateFront.limit

        if (templateFront.length > limit) {
            return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", limit.toString()), 5000, "error")
        }

        const limit2 = CardTypeVariantUtils.getInstance().storeSchema.templateBack.limit

        if (templateBack.length > limit2) {
            return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", limit2.toString()), 5000, "error")
        }

        if (cardTypeVariant.templateFront === templateFront && cardTypeVariant.templateBack === templateBack) {
            return this.snackbar(StaticText.CHANGES_SAVED, 3000)
        }

        CardTypeVariantUtils.getInstance().update({
            ...cardTypeVariant,
            templateFront,
            templateBack
        })

        this.snackbar(StaticText.CHANGES_SAVED, 3000)
    }

    public setDefaultCardTypeVariant = (cardType: CardType) => {
        const variant = CardTypeVariantUtils.getInstance().get("cardTypeId", cardType.id)
        if (!variant) throw new Error("No default variant found")
        this.states.selectedCardTypeVariantIdState.set(variant.id)
    }

    public selectTempCardTypeVariant = (cardTypeVariant: CardTypeVariant) => {
        this.states.tempSelectedCardTypeVariantState.set(cardTypeVariant)
    }

    public getTempSelectedCardTypeVariant = (): CardTypeVariant | never => {
        const val = this.states.tempSelectedCardTypeVariantState.val
        if (!val) throw new Error("No card type variant selected")
        return val
    }


}