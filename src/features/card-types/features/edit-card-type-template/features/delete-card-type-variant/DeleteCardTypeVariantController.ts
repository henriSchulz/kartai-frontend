import ModalController, {ModalControllerOptions} from "../../../../../../controller/abstract/ModalController";
import CardTypeVariant from "../../../../../../types/dbmodel/CardTypeVariant";
import EditCardTypeTemplateController from "../../EditCardTypeTemplateController";
import CardTypeVariantUtils from "../../../../../../utils/CardTypeVariantUtils";
import {StaticText} from "../../../../../../data/text/staticText";

interface DeleteCardTypeVariantControllerOptions extends ModalControllerOptions {
    editCardTypeTemplateController: EditCardTypeTemplateController
}

export default class DeleteCardTypeVariantController extends ModalController<DeleteCardTypeVariantControllerOptions> {

    public editCardTypeTemplateController: EditCardTypeTemplateController;

    constructor(options: DeleteCardTypeVariantControllerOptions) {
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
        const cardType = this.editCardTypeTemplateController.cardTypesController.getTempSelectedCardType()
        const cardTypeVariant = this.editCardTypeTemplateController.getTempSelectedCardTypeVariant()
        CardTypeVariantUtils.getInstance().delete(cardTypeVariant.id)
        this.editCardTypeTemplateController.setDefaultCardTypeVariant(cardType)
        this.snackbar(StaticText.VARIANT_DELETED, 3000)

        this.close()
    }
}