import BaseModel from "./BaseModel";

export default interface SharedItem extends BaseModel {
    sharedItemId: string
    sharedItemName: string
    clientId: string
    downloads: number
}

