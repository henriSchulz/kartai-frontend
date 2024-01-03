import State from "./types/State";
import ErrorModalProps from "./types/ErrorModalProps";
import React from "react";
import {SnackbarFunction, SnackbarProps} from "./types/snackbar";
import ApiService from "./services/ApiService";
import Deck from "./types/dbmodel/Deck";
import Directory from "./types/dbmodel/Directory";
import Card from "./types/dbmodel/Card";
import FieldContent from "./types/dbmodel/FieldContent";
import CardType from "./types/dbmodel/CardType";
import Field from "./types/dbmodel/Field";
import CardTypeVariant from "./types/dbmodel/CardTypeVariant";
import {
    cardsSlice,
    cardTypesSlice,
    cardTypeVariantsSlice,
    decksSlice,
    directoriesSlice, fieldContentsSlice,
    fieldsSlice
} from "./stores/slices";
import {StaticText} from "./data/text/staticText";
import store from "./stores/store";
import {wait, windowWidthLessThan} from "./utils/general";
import AuthenticationService from "./services/AuthenticationService";
import {NavigateFunction} from "react-router-dom";
import RequestBuilder from "./lib/RequestBuilder";
import {Settings} from "./Settings";
import defaultCardType, {DefaultBothDirectionsCardType, DefaultTextFieldCardType} from "./data/defaultCardType";
import CardTypeUtils from "./utils/CardTypeUtils";
import FieldUtils from "./utils/FieldUtils";
import CardTypeVariantUtils from "./utils/CardTypeVariantUtils";
import {rgbToHex} from "@mui/material";
import DefaultCardType from "./data/defaultCardType";
import {LocalStorageKeys} from "./data/LocalStorageKeys";


interface AppControllerOptions {
    navigate: NavigateFunction
    path: string
    states: {
        topLevelInitDoneState: State<boolean>
        errorModalPropsState: State<ErrorModalProps | null>
        snackbarPropsState: State<SnackbarProps | null>
        syncProgressState: State<number>
        showLoadingBackdropState: State<boolean>
        showCookieConsentState: State<boolean>
    }
}


export default class AppController {

    public states: AppControllerOptions["states"]

    private navigate: NavigateFunction

    private path: string

    constructor(options: AppControllerOptions) {
        this.states = options.states
        this.navigate = options.navigate
        this.path = options.path
    }


    public isPublicPage(): boolean {
        const publicPages = ["/public-decks", "/public-deck"]


        if (this.path === "/") return true
        if (publicPages.includes(this.path)) return true

        for (const publicPage of publicPages) {
            if (this.path.startsWith(publicPage)) return true
        }


        return false
    }

    async init() {
        try {


            const isAuth = await AuthenticationService.init()

            this.states.syncProgressState.set(1)
            if (isAuth) {
                const request = RequestBuilder.buildRequest({
                    url: `${Settings.API_HOST}/all`,
                    method: "GET",
                    token: AuthenticationService.current?.token
                })

                const response = await request.send<{
                    decks: Deck[],
                    cards: Card[],
                    fields: Field[],
                    cardTypes: CardType[],
                    fieldContents: FieldContent[],
                    directories: Directory[],
                    cardTypeVariants: CardTypeVariant[]
                }>()

                if (!response.data) {
                    throw new Error("Response data is undefined")
                }


                const {decks, cards, fields, cardTypes, fieldContents, directories, cardTypeVariants} = response.data


                store.dispatch(decksSlice.actions.init(decks))
                store.dispatch(directoriesSlice.actions.init(directories))
                store.dispatch(cardsSlice.actions.init(cards))
                store.dispatch(cardTypesSlice.actions.init(cardTypes))
                store.dispatch(fieldsSlice.actions.init(fields))
                store.dispatch(cardTypeVariantsSlice.actions.init(cardTypeVariants))
                store.dispatch(fieldContentsSlice.actions.init(fieldContents))


                await DefaultCardType.addIfNotExists()
                await DefaultTextFieldCardType.addIfNotExists()
                await DefaultBothDirectionsCardType.addIfNotExists()


            } else {
                if (!this.isPublicPage()) {
                    this.navigate("/")
                }
            }


            if (!Settings.ALLOWS_COOKIES) {
                this.states.showCookieConsentState.set(true)
            }

        } catch (e) {
            console.log(e)
            this.states.errorModalPropsState.set({
                title: StaticText.NO_API_CONNECTION,
                message: StaticText.NO_API_CONNECTION_TEXT,
            })
        }
    }

    public snackbar = (message: string, autoHideDuration: number, variant: SnackbarProps["variant"]) => {

        this.states.snackbarPropsState.set(null)

        const snackbarProps: SnackbarProps = {
            message,
            autoHideDuration,
            variant: variant ?? "default"
        }
        setTimeout(() => this.states.snackbarPropsState.set(snackbarProps), 50)
    }

    public closeSnackbar = () => {
        this.states.snackbarPropsState.set(null)
    }

    public loadingBackdrop = (show: boolean) => {
        this.states.showLoadingBackdropState.set(show)
    }

    public showSidebar(path: string): boolean {
        if (path === "/") return false
        if (!AuthenticationService.current) return false

        return !windowWidthLessThan("lg");
    }

    public showSyncModal(path: string): boolean {
        if (path === "/") return false
        return !this.states.topLevelInitDoneState.val
    }


    public showCardTypesOption(pathname: string): boolean {
        if (!AuthenticationService.current) return false

        return pathname !== "/"
    }

    public onAllowCookies = () => {
        localStorage.setItem(LocalStorageKeys.ALLOWS_COOKIES, String(1))
        window.location.reload()
    }


}