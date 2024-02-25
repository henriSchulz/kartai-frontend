import {
    DeleteOutlined,
    DriveFileMoveOutlined,
    EditOutlined,
    InfoOutlined,
    IosShareOutlined,
    Share
} from "@mui/icons-material";
import {StaticText} from "../../../data/text/staticText";
import React from "react";
import KartAIItemMenu, {ItemMenuItem} from "../../../components/KartAIItemMenu";
import KartAIContextMenu from "../../../components/KartAIContextMenu";

interface DeckOverviewItemContextMenuProps {
    onClose(): void

    position?: { x: number, y: number }
    entitiesSelected: boolean
    isShared: boolean
    menuFunctions: {
        onRename(): void
        onDelete(): void
        onExport(): void
        onInfo(): void
        onMove(): void
        onShare(): void
    }
}

export default function (props: DeckOverviewItemContextMenuProps) {
    const menuItems: ItemMenuItem[] = [
        {
            text: StaticText.RENAME,
            icon: <EditOutlined fontSize="small"/>,
            onClick: () => {
                props.menuFunctions.onRename()
                props.onClose()
            },
            hidden: props.entitiesSelected
        },
        {
            text: StaticText.MOVE,
            icon: <DriveFileMoveOutlined fontSize="small"/>,
            onClick: () => {
                props.menuFunctions.onMove()
                props.onClose()
            },
            dividerUnderneath: !props.entitiesSelected
        },
        {
            text: StaticText.PUBLISH,
            icon: <Share fontSize="small"/>,
            onClick: () => {
                props.menuFunctions.onShare()
                props.onClose()
            },
            hidden: props.entitiesSelected || props.isShared
        },
        {
            text: StaticText.EXPORT,
            icon: <IosShareOutlined fontSize="small"/>,
            onClick: () => {
                props.menuFunctions.onExport()
                props.onClose()
            },
            hidden: props.entitiesSelected,
            dividerUnderneath: !props.entitiesSelected
        },
        {
            text: StaticText.INFORMATION,
            icon: <InfoOutlined fontSize="small"/>,
            onClick: () => {
                props.menuFunctions.onInfo()
                props.onClose()
            },
            hidden: props.entitiesSelected
        },
        {
            text: StaticText.DELETE,
            icon: <DeleteOutlined fontSize="small"/>,
            onClick: () => {
                props.menuFunctions.onDelete()
                props.onClose()
            }
        }
    ]

    return <KartAIContextMenu position={props.position} onClose={props.onClose}
                              menuItems={menuItems}/>

}

