import BaseModel from "../types/dbmodel/BaseModel";
import EntityUtilsDataOptions from "../types/EntityUtilsDataOptions";


export default class EntityUtilsData<T extends BaseModel> {


    public entityArray: T[]

    public entityMap: Map<string, T>

    constructor(entityArray: T[]) {
        this.entityArray = entityArray;
        this.entityMap = new Map<string, T>();
        for (const t of entityArray) {
            this.entityMap.set(t.id, t);
        }
    }

    public asArray(options?: EntityUtilsDataOptions<T>): T[] {

        if (options?.filter) return this.entityArray.filter(options.filter)

        return this.entityArray;
    }

    public asMap(options?: EntityUtilsDataOptions<T>): Map<string, T> {
        if (!options?.filter) return this.entityMap
        const map = new Map<string, T>()

        for (const t of this.entityArray) {
            if (options.filter(t)) map.set(t.id, t)
        }

        return map
    }


}