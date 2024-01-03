import KartAIItemMenu from "../../../components/KartAIItemMenu";
import {StaticText} from "../../../data/text/staticText";
import {Delete, DeleteOutlined, Edit, EditOutlined} from "@mui/icons-material";

interface CardTypeItemMenuProps {
    anchorEl: HTMLElement | null,
    onClose(): void
    actions: {
        onEdit(): void
        onEditTemplate(): void
        onDelete(): void
    }
}


export default function ({actions, anchorEl, onClose}: CardTypeItemMenuProps) {
    const menuItems = [
        {
            text: StaticText.EDIT,
            icon: <EditOutlined />,
            onClick() {
                actions.onEdit()
                onClose()
            }
        }, {
            text: StaticText.EDIT_CARD_TEMPLATE,
            icon: <EditOutlined />,
            onClick() {
                actions.onEditTemplate()
                onClose()
            },
            dividerUnderneath: true
        }, {
            text: StaticText.DELETE,
            icon: <DeleteOutlined />,
            onClick() {
                actions.onDelete()
                onClose()
            }
        }
    ]

    return <KartAIItemMenu
        show={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        menuItems={menuItems}
    />
}