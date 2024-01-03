import ModalController, {ModalControllerOptions} from "../../../../../../controller/abstract/ModalController";
import {generateModelId, getTextFieldValue} from "../../../../../../utils/general";
import CardTypeVariantUtils from "../../../../../../utils/CardTypeVariantUtils";
import {StaticText} from "../../../../../../data/text/staticText";
import CardTypeVariant from "../../../../../../types/dbmodel/CardTypeVariant";
import EditCardTypeTemplateController from "../../EditCardTypeTemplateController";
import FieldUtils from "../../../../../../utils/FieldUtils";

interface NewCardTypeVariantControllerOptions extends ModalControllerOptions {
    editCardTypeTemplateController: EditCardTypeTemplateController
}


export default class NewCardTypeVariantController extends ModalController<NewCardTypeVariantControllerOptions> {

    public editCardTypeTemplateController: EditCardTypeTemplateController;

    constructor(options: NewCardTypeVariantControllerOptions) {
        super(options);
        this.editCardTypeTemplateController = options.editCardTypeTemplateController;
    }


    public open = () => {
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        const name = getTextFieldValue("card-type-variant-name")


        if (!name || name === "" || name?.replaceAll(" ", "").length === 0) {
            return this.snackbar(StaticText.FIELD_EMPTY, 5000, "error")
        }

        const limit = CardTypeVariantUtils.getInstance().storeSchema.name.limit

        if (name.length > limit) {
            return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", limit.toString()), 5000, "error")
        }

        const cardType = this.editCardTypeTemplateController.cardTypesController.getTempSelectedCardType()

        const {templateFront, templateBack} = CardTypeVariantUtils.generateDefaultTemplates(
            FieldUtils.getInstance().getAllBy("cardTypeId", cardType.id)
        )

        const cardTypeVariant: CardTypeVariant = {
            id: generateModelId(),
            name,
            cardTypeId: cardType.id,
            templateFront, templateBack,
        }

        CardTypeVariantUtils.getInstance().add(cardTypeVariant)
        this.close()
        this.editCardTypeTemplateController.states.selectedCardTypeVariantIdState.set(cardTypeVariant.id)
        this.snackbar(StaticText.CARD_TYPE_VARIANT_ADDED, 3000)
    }

}