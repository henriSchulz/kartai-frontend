import State from "./State";
import {DeckOrDirectory} from "./DeckOrDirectory";
import BaseModel from "./dbmodel/BaseModel";

export default interface ViewEntitySelectionControllerOptions<T extends BaseModel> {
    states: {
        selectedEntitiesState: State<T[]>
        selectedEntitiesAnchorElState: State<T | null>
    },
    viewItemsGetter(): T[]

}