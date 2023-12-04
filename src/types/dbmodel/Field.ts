import BaseModel from "./BaseModel";

export default interface Field extends BaseModel {
    readonly name: string
    readonly cardTypeId: string
}