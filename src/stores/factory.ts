import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import BaseModel from "../types/dbmodel/BaseModel";
import ApiService from "../services/ApiService";
import EntityTypeMap from "../types/EntityTypeMap";


export function getSlice<T extends BaseModel>(id: keyof EntityTypeMap) {
    return createSlice({
        name: id,
        initialState: {
            value: new Map<string, T>(),
            isInitialized: false
        },
        reducers: {
            init(state, action: PayloadAction<T[]>) {
                if (!action.payload) {
                    throw new Error("Payload is undefined")
                }

                for (const actionElement of action.payload) {
                    state.value.set(actionElement.id, actionElement as Draft<T>)
                }
                state.isInitialized = true
            },

            add(state, action: PayloadAction<T[] | T>) {
                if (!state.isInitialized) throw new Error("Slice is not initialized: " + id)

                if (!action.payload) {
                    throw new Error("Payload is undefined")
                }
                if (Array.isArray(action.payload)) {
                    for (const actionElement of action.payload) {
                        state.value.set(actionElement.id, actionElement as Draft<T>)
                    }
                } else {
                    state.value.set(action.payload.id, action.payload as Draft<T>)
                }
            },
            update(state, action: PayloadAction<T[] | T>) {
                if (!state.isInitialized) throw new Error("Slice is not initialized")
                if (!action.payload) {
                    throw new Error("Payload is undefined")
                }

                if (Array.isArray(action.payload)) {
                    for (const actionElement of action.payload) {
                        state.value.set(actionElement.id, actionElement as Draft<T>)
                    }
                } else {
                    state.value.set(action.payload.id, action.payload as Draft<T>)
                }
            },
            delete(state, action: PayloadAction<string[] | string>) {
                if (!state.isInitialized) throw new Error("Slice is not initialized")

                if (!action.payload) {
                    throw new Error("Payload is undefined")
                }

                if (typeof action.payload === "string") {
                    state.value.delete(action.payload)
                } else {
                    for (const actionElement of action.payload) {
                        state.value.delete(actionElement)
                    }
                }
            }
        }
    })
}