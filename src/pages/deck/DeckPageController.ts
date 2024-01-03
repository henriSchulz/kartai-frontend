import {SnackbarFunction} from "../../types/snackbar";
import ViewEntitySelectionController from "../../controller/ViewEntitySelectionController";
import Card from "../../types/dbmodel/Card";
import State from "../../types/State";
import CardUtils from "../../utils/CardUtils";
import DeckUtils from "../../utils/DeckUtils";

interface DeckPageControllerOptions {
    deckOrDirectoryId: string,
    snackbar: SnackbarFunction,
    topLevelInitDone: boolean,
}


export default class DeckPageController {

    private readonly snackbar: SnackbarFunction
    private readonly topLevelInitDone: boolean

    constructor(options: DeckPageControllerOptions) {
        this.snackbar = options.snackbar
        this.topLevelInitDone = options.topLevelInitDone
    }






}