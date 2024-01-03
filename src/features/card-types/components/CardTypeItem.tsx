import CardType from "../../../types/dbmodel/CardType";
import {row} from "../../../styles/listView";
import {Typography} from "@mui/material";
import OutlinedIconButton from "../../../components/OutlinedIconButton";
import {MoreHoriz} from "@mui/icons-material";
import CardTypeItemMenu from "./CardTypeItemMenu";
import {useState} from "react";
import KartAIBox from "../../../components/ui/KartAIBox";
import React from "react";
import {isDefaultCardType} from "../../../data/defaultCardType";
import CardTypesController from "../CardTypesController";
import {StaticText} from "../../../data/text/staticText";

interface CardTypeItemProps {
    controller: CardTypesController
    cardType: CardType
    actions: {
        onDelete(): void
        onEdit(): void
        onEditTemplate(): void
    }
}

export default function ({cardType, actions, controller}: CardTypeItemProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (isDefaultCardType(cardType)) {
            controller.snackbar(StaticText.DEFAULT_CARD_TYPES_CANNOT_BE_MODIFIED, 4000, "info")
        } else {
            setAnchorEl(e.currentTarget)
        }
    }

    return <KartAIBox sx={row(false)}>
        <Typography variant="h5">{cardType.name}</Typography>

        <OutlinedIconButton onClick={onClick}>
            <MoreHoriz/>
        </OutlinedIconButton>

        <CardTypeItemMenu onClose={() => setAnchorEl(null)} anchorEl={anchorEl} actions={actions}/>

    </KartAIBox>
}