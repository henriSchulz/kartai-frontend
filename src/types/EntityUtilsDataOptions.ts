import BaseModel from "./dbmodel/BaseModel";

export  default  interface EntityUtilsDataOptions<T extends BaseModel> {
    filter?: (entity: T) => boolean
}