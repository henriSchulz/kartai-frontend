import BaseModel from "./BaseModel";

export default interface CardTypeVariant extends BaseModel {
    readonly name: string
    readonly cardTypeId: string
    readonly templateFront: string
    readonly templateBack: string
}