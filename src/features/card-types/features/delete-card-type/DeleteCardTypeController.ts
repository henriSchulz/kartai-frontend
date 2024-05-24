import State from "../../../../types/State";
import CardTypesController from "../../CardTypesController";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardType from "../../../../types/dbmodel/CardType";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import {StaticText} from "../../../../data/text/staticText";
import CardUtils from "../../../../utils/CardUtils";

interface DeleteCardTypeControllerOptions extends ModalControllerOptions {
    cardTypesController: CardTypesController
    states: {
        showState: State<boolean>

    }
}

export default class DeleteCardTypeController extends ModalController<DeleteCardTypeControllerOptions> {

    public cardTypesController: CardTypesController;

    constructor(options: DeleteCardTypeControllerOptions) {
        super(options);
        this.cardTypesController = options.cardTypesController;

    }

    public open = (cardType?: CardType) => {
        this.cardTypesController.selectTempCardType(cardType!)
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public getAffectedCardCount = () => {
        return CardUtils.getInstance().getAllBy("cardTypeId", this.cardTypesController.getTempSelectedCardType().id).length
    }

    public submit = () => {
        const cardTypeId = this.cardTypesController.getTempSelectedCardType().id
        CardTypeUtils.getInstance().delete(cardTypeId)
        CardUtils.getInstance().deleteBy("cardTypeId", cardTypeId, {local: true, api: false})
        this.snackbar(StaticText.CARD_TYPE_DELETED, 3000)
        this.close()
    }
}