import BaseModel from "./BaseModel";

export default interface SharedItem extends BaseModel {
    sharedItemId: string
    clientId: string
}

