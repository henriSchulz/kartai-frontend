import EditCardTypeTemplateController from "./EditCardTypeTemplateController";
import CardTypeVariantUtils from "../../../../utils/CardTypeVariantUtils";
import {useEffect, useMemo, useState} from "react";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import KartAISelect from "../../../../components/ui/KartAISelect";
import KartAIButton from "../../../../components/ui/KartAIButton";
import {Add, DeleteOutlined, EditOutlined, ExpandMore} from "@mui/icons-material";
import KartAIPopperMenu from "../../../../components/KartAIPopperMenu";
import {isXsWindow} from "../../../../utils/general";
import {Divider, FormControlLabel, Radio, RadioGroup, Stack} from "@mui/material";
import KartAITextField from "../../../../components/ui/KartAITextField";
import NewCardTypeVariantController from "./features/new-card-type-variant/NewCardTypeVariantController";
import NewCardTypeVariantModal from "./features/new-card-type-variant/NewCardTypeVariantModal";
import CardContent from "../../../../pages/study-cards/components/CardContent";
import {createSampleFieldContentPairs} from "../../../../data/defaultCardType";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import DeleteCardTypeVariantController from "./features/delete-card-type-variant/DeleteCardTypeVariantController";
import DeleteCardTypeVariantModal from "./features/delete-card-type-variant/DeleteCardTypeVariantModal";
import RenameCardTypeVariantController from "./features/rename-card-type-variant/RenameCardTypeVariantController";
import RenameCardTypeVariantModal from "./features/rename-card-type-variant/RenameCardTypeVariantModal";
import {useAppSelector} from "../../../../hooks/reduxUtils";

interface EditCardTypeTemplateModalProps {
    controller: EditCardTypeTemplateController
}


export default function ({controller}: EditCardTypeTemplateModalProps) {

    const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);
    const [showNewCardTypeVariantModal, setShowNewCardTypeVariantModal] = useState(false)
    const [showDeleteCardTypeVariantModal, setShowDeleteCardTypeVariantModal] = useState(false)
    const [showRenameCardTypeVariantModal, setShowRenameCardTypeVariantModal] = useState(false)

    const newCardTypeVariantController = new NewCardTypeVariantController({
        editCardTypeTemplateController: controller, snackbar: controller.snackbar,
        states: {
            showState: {
                val: showNewCardTypeVariantModal,
                set: setShowNewCardTypeVariantModal
            }
        }
    })

    const deleteCardTypeVariantController = new DeleteCardTypeVariantController({
        editCardTypeTemplateController: controller, snackbar: controller.snackbar,
        states: {
            showState: {
                val: showDeleteCardTypeVariantModal,
                set: setShowDeleteCardTypeVariantModal
            }
        }
    })

    const renameCardTypeVariantController = new RenameCardTypeVariantController({
        editCardTypeTemplateController: controller, snackbar: controller.snackbar, states: {
            showState: {
                val: showRenameCardTypeVariantModal,
                set: setShowRenameCardTypeVariantModal
            }
        }

    })

    const cardTypeVariants = useAppSelector(state => state.cardTypeVariants.value)

    const data = useMemo(() => {

        const cardType = controller.cardTypesController.states.tempSelectedCardTypeState.val

        if (!cardType) return null

        return {
            cardType: cardType,
            variants: CardTypeVariantUtils.getAllBy(cardTypeVariants, "cardTypeId", cardType.id)
        }
    }, [controller.states.showState.val,
        // newCardTypeVariantController.states.showState.val
        // , deleteCardTypeVariantController.states.showState.val,
        // renameCardTypeVariantController.states.showState.val,
        cardTypeVariants
    ])


    const currentVariantData = useMemo(() => {
        if (!data) return null

        const cardTypeVariant = data.variants.find(v => v.id === controller.states.selectedCardTypeVariantIdState.val)!
        return {
            cardTypeVariant,
        }


    }, [controller.states.selectedCardTypeVariantIdState.val, data])

    const currentTemplate = controller.states.currentTemplateState.val


    useEffect(() => {
        if (!data) return
        const cardTypeVariant = data.variants.find(v => v.id === controller.states.selectedCardTypeVariantIdState.val)!
        controller.states.templateFrontState.set(cardTypeVariant.templateFront)
        controller.states.templateBackState.set(cardTypeVariant.templateBack)
    }, [controller.states.showState.val, currentVariantData?.cardTypeVariant])

    const sampleFieldContentPairs = useMemo(() => {
        const cardType = controller.cardTypesController.states.tempSelectedCardTypeState.val
        if (!cardType) return []

        const pairs = FieldContentUtils.getInstance().getFieldContentPairsByCardTypeId(cardType.id)

        if (pairs.length === 0) {
            return createSampleFieldContentPairs(cardType.id)
        }

        return pairs
    }, [])


    return <KartAIBox>

        {showNewCardTypeVariantModal && <NewCardTypeVariantModal controller={newCardTypeVariantController}/>}
        {showDeleteCardTypeVariantModal && <DeleteCardTypeVariantModal controller={deleteCardTypeVariantController}/>}
        {showRenameCardTypeVariantModal && <RenameCardTypeVariantModal controller={renameCardTypeVariantController}/>}


        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            title={StaticText.EDIT_CARD_TEMPLATE}
            cancelButtonText={StaticText.GO_BACK}
            submitButtonText={StaticText.SAVE}
            size={isXsWindow() ? "xs" : "md"}
        >

            <KartAIBox flexCenter>
                <KartAISelect size="small" fullWidth
                              options={(data?.variants ?? []).map(v => ({
                                  label: controller.getVariantDescription(v),
                                  value: v.id
                              }))}
                              value={controller.states.selectedCardTypeVariantIdState.val}
                              onChange={controller.states.selectedCardTypeVariantIdState.set}
                />

                <KartAIButton sx={{ml: 2, py: 0.9}} size="medium" onClick={e => setOptionsAnchorEl(e.currentTarget)}
                              variant="contained" startIcon={<ExpandMore/>}>
                    {StaticText.OPTIONS}
                </KartAIButton>

                <KartAIPopperMenu show={Boolean(optionsAnchorEl)} anchorEl={optionsAnchorEl}
                                  onClose={() => setOptionsAnchorEl(null)} menuItems={[
                    {
                        text: StaticText.NEW_VARIANT,
                        icon: <Add/>,
                        onClick: () => {
                            newCardTypeVariantController.open()
                        },
                        hidden: data?.variants.length === 6
                    },
                    {
                        text: StaticText.RENAME_VARIANT,
                        icon: <EditOutlined/>,
                        onClick: () => {
                            renameCardTypeVariantController.open(currentVariantData!.cardTypeVariant)
                        }
                    },

                    {
                        text: StaticText.DELETE_VARIANT,
                        icon: <DeleteOutlined/>,
                        onClick: () => {
                            const cardTypeVariant = currentVariantData!.cardTypeVariant
                            deleteCardTypeVariantController.open(cardTypeVariant)
                        },
                        hidden: data?.variants.length === 1
                    }
                ]}/>
            </KartAIBox>

            <Divider sx={{my: 2}}/>

            <RadioGroup
                row
                value={controller.states.currentTemplateState.val}
                onChange={e => controller.states.currentTemplateState.set(e.target.value as "front" | "back")}
            >
                <FormControlLabel value="front" control={<Radio/>} label={StaticText.FRONT_TEMPLATE}/>
                <FormControlLabel value="back" control={<Radio/>} label={StaticText.BACK_TEMPLATE}/>
            </RadioGroup>

            <Stack direction={{xs: "column", md: "row"}} sx={{maxHeight: 265}} spacing={2} mt={2}>
                <KartAIBox halfWidth gridCenter>
                    <KartAITextField
                        label={currentTemplate === "front" ? StaticText.FRONT_TEMPLATE : StaticText.BACK_TEMPLATE}
                        size="medium"
                        rows={10}
                        multiline
                        variant="outlined"
                        fullWidth
                        value={currentTemplate === "front" ? controller.states.templateFrontState.val : controller.states.templateBackState.val}
                        onChange={value => {
                            if (currentTemplate === "front") {
                                controller.states.templateFrontState.set(value)
                            } else {
                                controller.states.templateBackState.set(value)
                            }
                        }}
                    />
                </KartAIBox>
                <KartAIBox gridCenter halfWidth styled sx={{my: "auto"}}>
                    <CardContent
                        unsetHeight={true}
                        fieldContentPairs={sampleFieldContentPairs}
                        backHidden={currentTemplate === "front"}
                        templateFront={controller.states.templateFrontState.val}
                        templateBack={controller.states.templateBackState.val}
                    />
                </KartAIBox>
            </Stack>


        </KartAIModal>

    </KartAIBox>

}