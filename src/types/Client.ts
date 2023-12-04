import BaseModel from "./dbmodel/BaseModel";


export default interface Client extends BaseModel {
    readonly email: string
    readonly userName?: string
    readonly token?: string
    readonly imgUrl?: string
}