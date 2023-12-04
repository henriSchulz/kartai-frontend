import EntityTypeMap from "../types/EntityTypeMap";
import BaseModel from "../types/dbmodel/BaseModel";
import RequestBuilder from "../lib/RequestBuilder";
import AuthenticationService from "./AuthenticationService";
import {Settings} from "../Settings";


export default class ApiService<T extends BaseModel> {

    private readonly id: string

    constructor(id: keyof EntityTypeMap) {
        this.id = id
    }

    async loadAll(): Promise<T[]> {
        const request = RequestBuilder.buildRequest({
            method: "GET",
            url: `${Settings.API_HOST}/${this.id}`,
            token: AuthenticationService.current?.token
        })

        const response = await request.send<{ entities: T[] }>()

        if (response.error || !response.data) {
            throw new Error(response.error ?? "Entities could not be loaded")
        }

        return response.data.entities
    }

    async add(entities: T[]): Promise<void> {
        const request = RequestBuilder.buildRequest({
            method: "POST",
            url: `${Settings.API_HOST}/${this.id}/add`,
            body: {entities},
            token: AuthenticationService.current?.token
        })

        const response = await request.send()

        if (response.error) {
            throw new Error(response.error)
        }
    }

    async update(entities: T[]): Promise<void> {
        const request = RequestBuilder.buildRequest({
            method: "POST",
            url: `${Settings.API_HOST}/${this.id}/update`,
            body: {entities},
            token: AuthenticationService.current?.token
        })

        const response = await request.send()

        if (response.error) {
            throw new Error(response.error)
        }
    }

    async delete(ids: string[]): Promise<void> {
        const request = RequestBuilder.buildRequest({
            method: "POST",
            url: `${Settings.API_HOST}/${this.id}/delete`,
            body: {ids},
            token: AuthenticationService.current?.token
        })

        const response = await request.send()

        if (response.error) {
            throw new Error(response.error)
        }
    }

}