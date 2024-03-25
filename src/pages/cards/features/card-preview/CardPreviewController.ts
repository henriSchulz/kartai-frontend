import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardsController from "../../CardsController";
import Card from "../../../../types/dbmodel/Card";
import CardTypeVariantUtils from "../../../../utils/CardTypeVariantUtils";
import State from "../../../../types/State";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import FieldContentPair from "../../../../types/FieldContentPair";

interface CardPreviewControllerOptions extends ModalControllerOptions {
    cardsController: CardsController
    states: {
        showState: State<boolean>,
        currentTemplateState: State<"front" | "back">
    }
}

export default class CardPreviewController extends ModalController<CardPreviewControllerOptions> {
    public cardsController: CardsController

    constructor(options: CardPreviewControllerOptions) {
        super(options)
        this.cardsController = options.cardsController
    }

    public open = (card?: Card) => {
        this.cardsController.selectTempCard(card!)
        this.states.showState.set(true)
    }

    public loadData = (): { templateFront: string, templateBack: string, fieldContentPairs: FieldContentPair[] } | null => {
        const card = this.cardsController.states.tempSelectedCardState.val

        if (!card) return null

        const cardTypeVariant = CardTypeVariantUtils.getInstance().get("cardTypeId", card.cardTypeId)

        const fieldContentPairs = FieldContentUtils.getInstance().getFieldContentPairs(card.id)

        return {
            templateFront: cardTypeVariant.templateFront,
            templateBack: cardTypeVariant.templateBack,
            fieldContentPairs,
        }
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        this.close()
    }
}