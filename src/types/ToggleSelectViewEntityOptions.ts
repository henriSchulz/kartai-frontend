import {DeckOrDirectory} from "./DeckOrDirectory";
import BaseModel from "./dbmodel/BaseModel";

export default interface ToggleSelectViewEntityOptions<T extends BaseModel> {
    viewItem: T
    setAsAnchorEl?: boolean
    singleSelect?: boolean
}