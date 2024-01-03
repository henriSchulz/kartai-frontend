import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardsController from "../../CardsController";
import State from "../../../../types/State";
import Card from "../../../../types/dbmodel/Card";
import {StaticText} from "../../../../data/text/staticText";
import CardUtils from "../../../../utils/CardUtils";

interface PauseContinueCardControllerOptions extends ModalControllerOptions {
    cardsController: CardsController
    states: {
        showState: State<boolean>
        isPausingState: State<boolean>
    }
}

export default class PauseContinueCardController extends ModalController<PauseContinueCardControllerOptions> {

    public cardsController: CardsController

    constructor(options: PauseContinueCardControllerOptions) {
        super(options)
        this.cardsController = options.cardsController
    }


    public getTexts = (): { title: string, text: string } => {
        const isPausing = this.states.isPausingState.val
        if (this.cardsController.entitiesSelected()) {
            return {
                title: (isPausing ? StaticText.PAUSE_CARDS : StaticText.CONTINUE_CARDS).replaceAll("{items}", this.cardsController.states.selectedEntitiesState.val.length.toString()),
                text: (isPausing ? StaticText.PAUSE_CARDS_TEXT : StaticText.CONTINUE_CARDS_TEXT)
            }
        } else {
            return {
                title: isPausing ? StaticText.PAUSE_CARD : StaticText.CONTINUE_CARD,
                text: isPausing ? StaticText.PAUSE_CARD_TEXT : StaticText.CONTINUE_CARD_TEXT
            }
        }
    }


    public open = (card?: Card, isPausing?: boolean) => {
        this.cardsController.selectTempCard(card!)
        this.states.isPausingState.set(Boolean(isPausing))
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {
        const isPausing = this.states.isPausingState.val
        if (this.cardsController.entitiesSelected()) {
            const cardsToUpdate = this.cardsController.states.selectedEntitiesState.val.map(card => {
                return {
                    ...card,
                    paused: isPausing ? 1 : 0
                }
            })
            CardUtils.getInstance().update(cardsToUpdate)
            this.snackbar(
                (isPausing ? StaticText.CARDS_PAUSED : StaticText.CARDS_CONTINUED).replaceAll("{items}", this.cardsController.states.selectedEntitiesState.val.length.toString()), 4000
            )
            this.cardsController.states.selectedEntitiesState.set([])
        } else {
            const card = this.cardsController.getSelectedCard()
            CardUtils.getInstance().update({
                ...card,
                paused: isPausing ? 1 : 0
            })
            this.snackbar(
                isPausing ? StaticText.CARD_PAUSED : StaticText.CARD_CONTINUED, 4000
            )
        }
        this.close()
    }


}