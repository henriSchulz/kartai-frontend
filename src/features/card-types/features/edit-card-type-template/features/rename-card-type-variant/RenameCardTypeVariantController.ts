import ModalController, {ModalControllerOptions} from "../../../../../../controller/abstract/ModalController";
import EditCardTypeTemplateController from "../../EditCardTypeTemplateController";
import CardTypeVariant from "../../../../../../types/dbmodel/CardTypeVariant";
import {getTextFieldValue} from "../../../../../../utils/general";
import {StaticText} from "../../../../../../data/text/staticText";
import CardTypeVariantUtils from "../../../../../../utils/CardTypeVariantUtils";

interface RenameCardTypeVariantControllerOptions extends ModalControllerOptions {
    editCardTypeTemplateController: EditCardTypeTemplateController
}

export default class RenameCardTypeVariantController extends ModalController<RenameCardTypeVariantControllerOptions> {

    public editCardTypeTemplateController: EditCardTypeTemplateController;

    constructor(options: RenameCardTypeVariantControllerOptions) {
        super(options);
        this.editCardTypeTemplateController = options.editCardTypeTemplateController;
    }

    public open = (cardTypeVariant?: CardTypeVariant) => {
        this.editCardTypeTemplateController.selectTempCardTypeVariant(cardTypeVariant!)
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        const cardTypeVariant = this.editCardTypeTemplateController.getTempSelectedCardTypeVariant()
        const cardTypeVariantName = getTextFieldValue("card-type-variant-name")!

        if (cardTypeVariantName === cardTypeVariant.name) {
            this.close()
            return this.snackbar(StaticText.CHANGES_SAVED, 3000)
        }

        if (cardTypeVariantName.length === 0 || cardTypeVariantName.replaceAll(" ", "").length === 0) {
            return this.snackbar(StaticText.FIELD_EMPTY, 3000)
        }

        const limit = CardTypeVariantUtils.getInstance().storeSchema.name.limit

        if (cardTypeVariantName.length > limit) {
            return this.snackbar(StaticText.INPUT_TOO_LONG.replaceAll("{chars}", limit.toString()), 3000)
        }

        CardTypeVariantUtils.getInstance().update({
            ...cardTypeVariant,
            name: cardTypeVariantName,
        })
        this.snackbar(StaticText.CHANGES_SAVED, 3000)
        this.close()
    }
}


