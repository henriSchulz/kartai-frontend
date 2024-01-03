import {OmittedStoreSchema, StoreSchema} from "../../types/StoreSchema";
import {StoreSchemaObject} from "../../types/StoreSchemaObject";
import BaseModel from "../../types/dbmodel/BaseModel";
import {Slice} from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import EntityTypeMap from "../../types/EntityTypeMap";
import store from "../../stores/store";
import EntityUtilsFuncOptions from "../../types/EntityUtilsFuncOptions";
import {ID_PROPERTIES} from "../general";
import ValueOf from "../../types/ValueOf";


export default abstract class EntityUtils<T extends BaseModel> {

    public static maxBatchSize = 400

    private readonly entitiesGetterFunction: () => Map<string, T>
    public readonly storeSchema: StoreSchema<T>
    public readonly maxClientSize: number
    private readonly id: keyof EntityTypeMap
    private readonly slice: Slice

    protected constructor(id: keyof EntityTypeMap, storeSchema: OmittedStoreSchema<T>, maxClientSize: number, entitiesGetterFunction: () => Map<string, T>, slice: Slice) {
        this.id = id
        this.storeSchema = {
            id: {type: "string", limit: ID_PROPERTIES.length},
            ...storeSchema
        } as Record<keyof T, StoreSchemaObject>
        this.maxClientSize = maxClientSize
        this.entitiesGetterFunction = entitiesGetterFunction
        this.slice = slice
    }

    get entities(): Map<string, T> {
        return this.entitiesGetterFunction()
    }


    isValidEntity(entity: T, ignoreKeys?: (keyof T)[]): boolean {

        for (const [key, value] of Object.entries(this.storeSchema)) {
            if ((ignoreKeys ?? []).includes(key as keyof T)) continue

            const entityValue = entity[key as keyof T] as (string | number)
            if (entityValue == null || typeof entityValue == undefined) {
                if (!value.nullable) {
                    console.log(`Invalid null for ${key} in ${this.id}`)
                    return false
                } else return true
            }

            if (typeof entityValue !== value.type) {
                console.log(`Invalid type for ${key} in ${this.id}`)
                return false
            }

            if (typeof entityValue === "string" && entityValue.length > value.limit) {
                console.log(`Invalid length for ${key} in ${this.id}`)
                return false
            }

            if (typeof entityValue === "number" && entityValue > value.limit) {
                console.log(`Invalid value for ${key} in ${this.id}`)
                return false
            }
        }
        return true
    }


    getById(id: string): T | never {
        return this.get("id", id)
    }


    get(where: keyof T, value: string | number): T | never {
        if (where === "id") return this.entities.get(value as string) as T

        const entityArray = Array.from(this.entities.values())

        for (let i = 0; i < entityArray.length; i++) {
            const entity = entityArray[i];
            if (entity[where] === value) {
                return entity
            }
        }


        throw new Error(`No entity found with ${String(where)} = ${value} in ${this.id}`)
    }

    getSize(): number {
        return this.entities.size
    }

    getAllBy(where: keyof T, value: string | number): T[] {
        const entities = []
        const entityArray = Array.from(this.entities.values())

        for (let i = 0; i < entityArray.length; i++) {
            const entity = entityArray[i];
            if (entity[where] === value) {
                entities.push(entity)
            }
        }

        return entities
    }

    toArray(): T[] {
        return Array.from(this.entities.values())
    }


    canAdd(numToAdd: number): boolean {
        return this.getSize() + numToAdd <= this.maxClientSize
    }

    has(id?: string): boolean {
        if (!id) return false
        return this.entities.has(id)
    }

    async add(entities: T | T[], options: EntityUtilsFuncOptions = {local: true, api: true}): Promise<void> {
        if (options.local) {
            store.dispatch(this.slice.actions.add(entities))
        }

        if (options.api) {
            const apiService = new ApiService(this.id)
            if (!Array.isArray(entities)) {
                try {
                    await apiService.add([entities])
                } catch (e) {
                    console.log(e)
                }
            } else {
                for (let i = 0; i < entities.length; i += EntityUtils.maxBatchSize) {
                    try {
                        console.log("Upload in ", this.id, "Batch:", `[${i}, ${i + EntityUtils.maxBatchSize}]`)
                        await apiService.add(entities.slice(i, i + EntityUtils.maxBatchSize))
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }

    }

    async update(entities: T | T[], options: EntityUtilsFuncOptions = {local: true, api: true}): Promise<void> {
        if (options.local) store.dispatch(this.slice.actions.update(entities))
        const apiService = new ApiService(this.id)
        if (options.api) {
            if (!Array.isArray(entities)) {
                try {
                    await apiService.update([entities])
                } catch (e) {
                    console.log(e)
                }
            } else {
                for (let i = 0; i < entities.length; i += EntityUtils.maxBatchSize) {
                    try {
                        await apiService.update(entities.slice(i, i + EntityUtils.maxBatchSize))
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
    }

    async delete(ids: string | string[], options: EntityUtilsFuncOptions = {local: true, api: true}): Promise<void> {
        if (options.local) store.dispatch(this.slice.actions.delete(ids))
        if (options?.api) {
            const apiService = new ApiService(this.id)
            if (!Array.isArray(ids)) {
                try {
                    await apiService.delete([ids])
                } catch (e) {
                    console.log(e)
                }
            } else {
                for (let i = 0; i < ids.length; i += EntityUtils.maxBatchSize) {
                    try {
                        await apiService.delete(ids.slice(i, i + EntityUtils.maxBatchSize))
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
    }

    async deleteBy(where: keyof T, ids: string | string[], options: EntityUtilsFuncOptions = {
        api: true,
        local: true
    }): Promise<void> {
        const idsToDelete = []

        for (const id of Array.isArray(ids) ? ids : [ids]) {
            idsToDelete.push(...this.getAllBy(where, id).map(e => e.id))
        }

        await this.delete(idsToDelete, options)
    }

    async updateById(id: string, properties: Partial<Record<keyof T, ValueOf<T>>>) {
        const entity = this.getById(id)
        if (!entity) return
        const updatedEntity = {...entity, ...properties}
        await this.update(updatedEntity)
    }

    static toArray<T extends BaseModel>(map: Map<string, T>): T[] {
        return Array.from(map.values())
    }

    static getAllBy<T extends BaseModel>(map: Map<string, T>, where: keyof T, value: string | number): T[] {
        const entities = []
        const entityArray = Array.from(map.values())

        for (let i = 0; i < entityArray.length; i++) {
            const entity = entityArray[i];
            if (entity[where] === value) {
                entities.push(entity)
            }
        }

        return entities
    }

    static get<T extends BaseModel>(map: Map<string, T>, where: keyof T, value: string | number): T | never {
        let val;

        if (where === "id") val = map.get(value as string) as T

        const entityArray = Array.from(map.values())

        for (let i = 0; i < entityArray.length; i++) {
            const entity = entityArray[i];
            if (entity[where] === value) {
                val = entity
            }
        }

        if (!val) {
            throw new Error(`No entity found with ${String(where)} = ${value}`)
        }

        return val
    }


    static toMap<T extends BaseModel>(entities: T[]): Map<string, T> {
        const map = new Map<string, T>()
        for (const entity of entities) {
            map.set(entity.id, entity)
        }
        return map
    }


}