import KartAIItemMenu, {ItemMenuItem} from "../../../components/KartAIItemMenu";
import {StaticText} from "../../../data/text/staticText";
import {
    ChangeCircleOutlined,
    Delete, DeleteOutlined,
    DriveFileMoveOutlined,
    Edit, EditOutlined, InfoOutlined,
    Pause,
    PlayArrow,
    PsychologyAltOutlined
} from "@mui/icons-material";
import Card from "../../../types/dbmodel/Card";
import CardsController from "../CardsController";
import CardTypeUtils from "../../../utils/CardTypeUtils";
import DeckUtils from "../../../utils/DeckUtils";

interface CardItemMenuProps {
    onClose(): void

    controller: CardsController
    card: Card, //can be null if multiple cards are selected
    anchorEl: HTMLElement | null
    entitiesSelected: boolean
    menuFunctions: {
        onEdit(): void
        onDelete(): void
        onInfo(): void
        onMove(): void
        onReset(): void
        onPause(): void
        onContinue(): void
        onChangeCardType(): void
    }
}

export default function (props: CardItemMenuProps) {


    const menuItems: ItemMenuItem[] = [
        {
            text: StaticText.EDIT,
            icon: <EditOutlined/>,
            onClick() {
                props.menuFunctions.onEdit()
                props.onClose()
            },
            hidden: props.entitiesSelected,
            dividerUnderneath: DeckUtils.getInstance().toArray().length === 1,
        },
        {
            text: StaticText.MOVE,
            icon: <DriveFileMoveOutlined/>,
            onClick() {
                props.menuFunctions.onMove()
                props.onClose()
            },
            hidden: DeckUtils.getInstance().toArray().length === 1,
            dividerUnderneath: true,
        },
        // {
        //     text: StaticText.CHANGE_CARD_TYPE,
        //     icon: <ChangeCircleOutlined/>,
        //     onClick() {
        //         props.menuFunctions.onChangeCardType()
        //         props.onClose()
        //     },
        //     hidden: (props.entitiesSelected && !props.controller.selectedEntitiesSameCardType())
        //         || CardTypeUtils.getInstance().toArray().length === 1,
        //     dividerUnderneath: true,
        // },
        {
            text: StaticText.FORGET,
            icon: <PsychologyAltOutlined/>,
            onClick() {
                props.menuFunctions.onReset()
                props.onClose()
            },
        },
        {
            text: StaticText.PAUSE,
            icon: <Pause/>,
            onClick() {
                props.menuFunctions.onPause()
                props.onClose()
            },
            hidden: !props.entitiesSelected && Boolean(props.card.paused),
            dividerUnderneath: !props.entitiesSelected && !Boolean(props.card.paused),
        },
        {
            text: StaticText.CONTINUE,
            icon: <PlayArrow/>,
            onClick() {
                props.menuFunctions.onContinue()
                props.onClose()
            },
            hidden: !props.entitiesSelected && !Boolean(props.card.paused),
            dividerUnderneath: true
        },
        {
            text: StaticText.INFORMATION,
            icon: <InfoOutlined/>,
            onClick() {
                props.menuFunctions.onInfo()
                props.onClose()
            },
            hidden: props.entitiesSelected
        },
        {
            text: StaticText.DELETE,
            icon: <DeleteOutlined/>,
            onClick() {
                props.menuFunctions.onDelete()
                props.onClose()
            }
        }
    ]

    return <KartAIItemMenu
        show={Boolean(props.anchorEl)}
        anchorEl={props.anchorEl}
        onClose={props.onClose}
        menuItems={menuItems}
    />

}