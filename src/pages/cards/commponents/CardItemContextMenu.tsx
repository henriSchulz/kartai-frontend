import KartAIItemMenu, {ItemMenuItem} from "../../../components/KartAIItemMenu";
import {StaticText} from "../../../data/text/staticText";
import {
    DeleteOutlined,
    DriveFileMoveOutlined,
    EditOutlined, InfoOutlined,
    Pause,
    PlayArrow,
    PsychologyAltOutlined
} from "@mui/icons-material";
import Card from "../../../types/dbmodel/Card";
import CardsController from "../CardsController";

import DeckUtils from "../../../utils/DeckUtils";
import KartAIContextMenu from "../../../components/KartAIContextMenu";

interface CardItemContextMenuProps {
    onClose(): void

    controller: CardsController
    card: Card, //can be null if multiple cards are selected
    position?: { x: number, y: number }
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

export default function (props: CardItemContextMenuProps) {


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

    return <KartAIContextMenu
        position={props.position}
        onClose={props.onClose}
        menuItems={menuItems}
    />

}