import BaseModel from "./BaseModel";

export default interface FieldContent extends BaseModel {
    fieldId: string
    cardId: string
    content: string
}