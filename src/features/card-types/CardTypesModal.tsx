import CardTypesController from "./CardTypesController";
import KartAIBox from "../../components/ui/KartAIBox";
import KartAIModal from "../../components/KartAIModal";
import {StaticText} from "../../data/text/staticText";
import ListView from "../../components/list-view/ListView";
import {useAppSelector} from "../../hooks/reduxUtils";
import {useMemo, useState} from "react";
import ListViewContent from "../../components/list-view/ListViewContent";
import {row} from "../../styles/listView";
import {Typography} from "@mui/material";
import OutlinedIconButton from "../../components/OutlinedIconButton";
import {Add, MoreHoriz} from "@mui/icons-material";
import {isXsWindow} from "../../utils/general";
import CardTypeItemMenu from "./components/CardTypeItemMenu";
import CardTypeItem from "./components/CardTypeItem";
import NewCardTypeController from "./features/new-card-type/NewCardTypeController";
import {useGlobalContext} from "../../App";
import NewCardTypeModal from "./features/new-card-type/NewCardTypeModal";
import DeleteCardTypeController from "./features/delete-card-type/DeleteCardTypeController";
import DeleteCardTypeModal from "./features/delete-card-type/DeleteCardTypeModal";
import EditCardTypeController from "./features/edit-card-type/EditCardTypeController";
import EditCardTypeModal from "./features/edit-card-type/EditCardTypeModal";
import EditCardTypeTemplateController from "./features/edit-card-type-template/EditCardTypeTemplateController";
import EditCardTypeTemplateModal from "./features/edit-card-type-template/EditCardTypeTemplateModal";
import CardTypeVariant from "../../types/dbmodel/CardTypeVariant";

interface CardTypesModalProps {
    controller: CardTypesController
}


export default function ({controller}: CardTypesModalProps) {

    const {snackbar} = useGlobalContext()

    const cardTypesMap = useAppSelector(state => state.cardTypes.value)

    const field = useAppSelector(state => state.fields.value)

    const cardTypeVariants = useAppSelector(state => state.cardTypeVariants.value)

    const [selectedCardTypeVariantId, setSelectedCardTypeVariantId] = useState<string>("")
    const [currentTemplate, setCurrentTemplate] = useState<"front" | "back">("front")
    const [templateFront, setTemplateFront] = useState<string>("")
    const [templateBack, setTemplateBack] = useState<string>("")
    const [tempSelectedCardTypeVariant, setTempSelectedCardTypeVariant] = useState<CardTypeVariant | null>(null)

    const [showNewCardTypeModal, setShowNewCardTypeModal] = useState(false)
    const [showDeleteCardTypeModal, setShowDeleteCardTypeModal] = useState(false)
    const [showEditCardTypeModal, setShowEditCardTypeModal] = useState(false)
    const [showEditCardTypeTemplateModal, setShowEditCardTypeTemplateModal] = useState(false)


    const [numOfFields, setNumOfFields] = useState(2)

    const cardTypeViewItems = useMemo(() => {
        return Array.from(cardTypesMap.values())
    }, [cardTypesMap])

    const newCardTypeController = new NewCardTypeController({
        cardTypesController: controller, snackbar,
        states: {
            showState: {val: showNewCardTypeModal, set: setShowNewCardTypeModal},
            numOfFieldsState: {val: numOfFields, set: setNumOfFields}
        }
    })

    const deleteCardTypeController = new DeleteCardTypeController({
        cardTypesController: controller, snackbar, states: {
            showState: {val: showDeleteCardTypeModal, set: setShowDeleteCardTypeModal}
        }
    })

    const editCardTypeController = new EditCardTypeController({
        cardTypesController: controller, snackbar, states: {
            showState: {val: showEditCardTypeModal, set: setShowEditCardTypeModal},
            numOfFieldsState: {val: numOfFields, set: setNumOfFields}
        }
    })

    const editCardTypeTemplateController = new EditCardTypeTemplateController({
        cardTypesController: controller, snackbar, states: {
            showState: {val: showEditCardTypeTemplateModal, set: setShowEditCardTypeTemplateModal},
            selectedCardTypeVariantIdState: {val: selectedCardTypeVariantId, set: setSelectedCardTypeVariantId},
            currentTemplateState: {val: currentTemplate, set: setCurrentTemplate},
            templateFrontState: {val: templateFront, set: setTemplateFront},
            templateBackState: {val: templateBack, set: setTemplateBack},
            tempSelectedCardTypeVariantState: {val: tempSelectedCardTypeVariant, set: setTempSelectedCardTypeVariant}
        }
    })


    const modalActionButton = {
        text: StaticText.ADD,
        icon: <Add/>,
        onClick() {
            newCardTypeController.open()
        }
    }


    return <KartAIBox>


        {showNewCardTypeModal && <NewCardTypeModal controller={newCardTypeController}/>}
        {showDeleteCardTypeModal && <DeleteCardTypeModal controller={deleteCardTypeController}/>}
        {showEditCardTypeModal && <EditCardTypeModal controller={editCardTypeController}/>}
        {showEditCardTypeTemplateModal && <EditCardTypeTemplateModal controller={editCardTypeTemplateController}/>}

        <KartAIModal hideCancelButton submitButtonText={StaticText.GO_BACK} size={isXsWindow() ? "xs" : "sm"}
                     title={StaticText.CARD_TYPES}
                     onSubmit={controller.submit}
                     onClose={controller.close}
                     show={controller.states.showState.val}
                     actionButton={modalActionButton}
        >
            <ListViewContent fullHeight>
                {cardTypeViewItems.map(cardType => {
                    return <CardTypeItem
                        controller={controller}
                        key={cardType.id}
                        cardType={cardType}
                        actions={{
                            onDelete() {
                                deleteCardTypeController.open(cardType)
                            },
                            onEdit() {
                                editCardTypeController.open(cardType)
                            },
                            onEditTemplate() {
                                editCardTypeTemplateController.open(cardType)
                            },
                        }}


                    />
                })}
            </ListViewContent>
        </KartAIModal>


    </KartAIBox>


}