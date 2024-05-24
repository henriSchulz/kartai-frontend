import ModalController, {ModalControllerOptions} from "../../../../controller/abstract/ModalController";
import CardsController from "../../CardsController";
import Card from "../../../../types/dbmodel/Card";
import {SnackbarFunction} from "../../../../types/snackbar";
import FieldUtils from "../../../../utils/FieldUtils";
import {StaticText} from "../../../../data/text/staticText";
import FieldContent from "../../../../types/dbmodel/FieldContent";
import {generateModelId, getTextFieldValue} from "../../../../utils/general";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import React from "react";

interface EditCardControllerOptions extends ModalControllerOptions {
    card: Card | null
}

export default class EditCardController extends ModalController<EditCardControllerOptions> {

    public card: Card | null

    constructor(options: EditCardControllerOptions) {
        super(options)
        this.card = options.card
    }

    public open = () => {
        this.states.showState.set(true)
    }

    public close = () => {
        this.states.showState.set(false)
    }

    public submit = () => {


        const maxTextLength = FieldContentUtils.getInstance().storeSchema.content.limit

        const fieldContentsToUpdate: FieldContent[] = []

        for (const fieldContentPair of FieldContentUtils.getInstance().getFieldContentPairs(this.card!.id)) {
            const {field, fieldContent} = fieldContentPair
            const textFieldValue = getTextFieldValue(field.id)

            if (!textFieldValue || textFieldValue.replaceAll(" ", "").length === 0) {
                return this.snackbar(StaticText.FIELD_EMPTY, 4000, "error")
            }

            if (textFieldValue.length > maxTextLength) {
                return this.snackbar(StaticText.FIELD_CONTENT_TOO_LONG
                        .replaceAll("{limit}", maxTextLength.toString())
                        .replaceAll("{field}", field.name)
                    , 4000, "error")
            }
            fieldContentsToUpdate.push({
                ...fieldContent,
                content: textFieldValue
            })
        }

        FieldContentUtils.getInstance().update(fieldContentsToUpdate)
        this.snackbar(StaticText.CHANGES_SAVED, 4000)
        this.close()
    }

    public getOnKeyboardShortcuts = (shortcuts: { [char: string]: () => void }, isModalOpen: boolean) => {
        return (event: KeyboardEvent) => {
            if (isModalOpen) return
            const ctrl = event.ctrlKey || event.metaKey

            if (ctrl) {
                const char = event.key
                if (shortcuts[char]) {
                    shortcuts[char]()
                }
            }
        }
    }



}