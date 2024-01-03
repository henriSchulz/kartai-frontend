import ModalController, {ModalControllerOptions} from "../../controller/abstract/ModalController";
import CardType from "../../types/dbmodel/CardType";
import State from "../../types/State";
import CardTypeUtils from "../../utils/CardTypeUtils";
import CardTypeVariantUtils from "../../utils/CardTypeVariantUtils";

interface CardTypesControllerOptions extends ModalControllerOptions {
    states: {
        showState: State<boolean>
        tempSelectedCardTypeState: State<CardType | null>
    }
}


export default class CardTypesController extends ModalController<CardTypesControllerOptions> {

    constructor(options: CardTypesControllerOptions) {
        super(options);
    }


    public open = () => {
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        this.close()
    }

    public selectTempCardType = (cardType: CardType) => {
        this.states.tempSelectedCardTypeState.set(cardType)
    }

    public getTempSelectedCardType = (): CardType | never => {
        const val = this.states.tempSelectedCardTypeState.val
        if (!val) throw new Error("No card type selected")
        return val
    }


}