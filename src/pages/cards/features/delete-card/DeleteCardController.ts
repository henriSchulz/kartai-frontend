import {SnackbarFunction} from "../../../../types/snackbar";
import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardsController from "../../CardsController";
import Card from "../../../../types/dbmodel/Card";
import CardUtils from "../../../../utils/CardUtils";
import {StaticText} from "../../../../data/text/staticText";

interface DeleteCardControllerOptions extends ModalControllerOptions {
    cardsController: CardsController
}


export default class DeleteCardController extends ModalController<DeleteCardControllerOptions> {


    public cardsController: CardsController


    constructor(options: DeleteCardControllerOptions) {
        super(options)
        this.cardsController = options.cardsController
    }


    public getTexts = (): { title: string, text: string } => {
        if (!this.cardsController.entitiesSelected()) {
            return {
                title: StaticText.DELETE_CARD + "?",
                text: StaticText.DELETE_CARD_TEXT,
            }
        } else {
            return {
                title: StaticText.DELETE_CARDS + ` (${this.cardsController.states.selectedEntitiesState.val.length})?`,
                text: StaticText.DELETE_CARDS_TEXT,
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
        this.cardsController.states.selectedEntitiesState.set([])
        if (this.cardsController.entitiesSelected()) {
            const idsToDelete: string[] = this.cardsController.states.selectedEntitiesState.val.map(card => card.id)
            CardUtils.getInstance().delete(idsToDelete)
            this.snackbar(
                StaticText.CARDS_DELETED.replaceAll("{items}", `${idsToDelete.length}`)
                , 4000)
        } else {
            const card = this.cardsController.getSelectedCard()
            CardUtils.getInstance().delete(card.id)
            this.snackbar(
                StaticText.CARD_DELETED, 4000)
        }

        this.close()
    }

}