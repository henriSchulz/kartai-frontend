import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardsController from "../../CardsController";
import {StaticText} from "../../../../data/text/staticText";
import CardUtils from "../../../../utils/CardUtils";
import Card from "../../../../types/dbmodel/Card";

interface ResetCardControllerOptions extends ModalControllerOptions {
    cardsController: CardsController
}

export default class ResetCardController extends ModalController<ResetCardControllerOptions> {
    public cardsController: CardsController

    constructor(options: ResetCardControllerOptions) {
        super(options)
        this.cardsController = options.cardsController
    }


    public getTexts = (): { title: string, text: string } => {
        if (this.cardsController.entitiesSelected()) {
            return {
                title: StaticText.FORGET_CARDS.replaceAll("{items}", this.cardsController.states.selectedEntitiesState.val.length.toString()),
                text: StaticText.FORGET_CARDS_TEXT
            }
        } else {
            return {
                title: StaticText.FORGET_CARD,
                text: StaticText.FORGET_CARD_TEXT
            }
        }
    }

    public open = (card?: Card) => {
        this.cardsController.selectTempCard(card!)
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        if (this.cardsController.entitiesSelected()) {
            const cardsToUpdate = this.cardsController.states.selectedEntitiesState.val.map(card => ({
                ...card,
                learningState: 0,
                dueAt: Date.now()
            }))

            CardUtils.getInstance().update(cardsToUpdate)
            this.snackbar(StaticText.CARDS_RESETED.replaceAll("{cards}", this.cardsController.states.selectedEntitiesState.val.length.toString()), 4000)
            this.cardsController.states.selectedEntitiesState.set([])
        } else {
            const card = this.cardsController.getSelectedCard()
            CardUtils.getInstance().update({
                ...card,
                learningState: 0,
                dueAt: Date.now()
            })
            this.snackbar(StaticText.CARD_RESETED, 4000)
        }
        this.close()
    }
}