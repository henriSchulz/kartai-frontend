import {OmittedStoreSchema, StoreSchema} from "../../types/StoreSchema";
import {StoreSchemaObject} from "../../types/StoreSchemaObject";
import BaseModel from "../../types/dbmodel/BaseModel";
import {Slice} from "@reduxjs/toolkit";
import ApiService from "../../services/ApiService";
import EntityTypeMap from "../../types/EntityTypeMap";
import store from "../../stores/store";


export default abstract class EntityUtils<T extends BaseModel> {

    private readonly maxBatchSize = 50

    private readonly entitiesGetterFunction: () => Map<string, T>
    public readonly storeSchema: StoreSchema<T>
    public readonly maxClientSize: number
    private readonly id: keyof EntityTypeMap
    private readonly slice: Slice

    protected constructor(id: keyof EntityTypeMap, storeSchema: OmittedStoreSchema<T>, maxClientSize: number, entitiesGetterFunction: () => Map<string, T>, slice: Slice) {
        this.id = id
        this.storeSchema = {
            id: {type: "string", limit: 36},
            ...storeSchema
        } as Record<keyof T, StoreSchemaObject>
        this.maxClientSize = maxClientSize
        this.entitiesGetterFunction = entitiesGetterFunction
        this.slice = slice
    }

    get entities(): Map<string, T> {
        return this.entitiesGetterFunction()
    }


    isValidEntity(entity: T): boolean {

        for (const [key, value] of Object.entries(this.storeSchema)) {
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
        let val;

        if (where === "id") val = this.entities.get(value as string) as T

        const entityArray = Array.from(this.entities.values())

        for (let i = 0; i < entityArray.length; i++) {
            const entity = entityArray[i];
            if (entity[where] === value) {
                val = entity
            }
        }


        if (!val) {
            throw new Error(`No entity found with ${String(where)} = ${value} in ${this.id}`)
        }

        return val

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

    has(id: string): boolean {
        return this.entities.has(id)
    }

    async add(entities: T | T[]): Promise<void> {
        store.dispatch(this.slice.actions.add(entities))
        const apiService = new ApiService(this.id)
        if (!Array.isArray(entities)) {
            try {
                await apiService.add([entities])
            } catch (e) {
                console.log(e)
            }
        } else {
            for (let i = 0; i < entities.length; i += this.maxBatchSize) {
                try {
                    console.log(entities.slice(i, i + this.maxBatchSize).length)
                    await apiService.add(entities.slice(i, i + this.maxBatchSize))
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    async update(entities: T | T[]): Promise<void> {
        store.dispatch(this.slice.actions.update(entities))
        const apiService = new ApiService(this.id)
        if (!Array.isArray(entities)) {
            try {
                await apiService.update([entities])
            } catch (e) {
                console.log(e)
            }
        } else {
            for (let i = 0; i < entities.length; i += this.maxBatchSize) {
                try {
                    await apiService.update(entities.slice(i, i + this.maxBatchSize))
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    async delete(ids: string | string[]): Promise<void> {
        store.dispatch(this.slice.actions.delete(ids))
        const apiService = new ApiService(this.id)
        if (!Array.isArray(ids)) {
            try {
                await apiService.delete([ids])
            } catch (e) {
                console.log(e)
            }
        } else {
            for (let i = 0; i < ids.length; i += this.maxBatchSize) {
                try {
                    await apiService.delete(ids.slice(i, i + this.maxBatchSize))
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

}