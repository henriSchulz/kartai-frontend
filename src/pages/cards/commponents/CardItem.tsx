import CardsController from "../CardsController";
import KartAIBox from "../../../components/ui/KartAIBox";
import React, {useEffect} from "react";
import Card from "../../../types/dbmodel/Card";
import FieldContent from "../../../types/dbmodel/FieldContent";
import FieldContentUtils from "../../../utils/FieldContentUtils";
import OutlinedIconButton from "../../../components/OutlinedIconButton";
import {Delete, Edit} from "@mui/icons-material";
import {Tooltip, Typography} from "@mui/material";
import CardUtils from "../../../utils/CardUtils";
import {cardRow, fieldContentStyle} from "../styles/cardItemStyles";
import CardItemMenu from "./CardItemMenu";
import NewCardController from "../features/new-card/NewCardController";
import EditCardController from "../features/edit-card/EditCardController";
import {useGlobalContext} from "../../../App";
import {StaticText} from "../../../data/text/staticText";

interface CardItemProps {
    card: Card
    controller: CardsController
    newCardController: NewCardController
    editCardController: EditCardController
    selected?: boolean
    actions: {
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


export default function ({card, controller, selected, actions, newCardController, editCardController}: CardItemProps) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const {cardTypesController} = useGlobalContext()


    const fieldContents: FieldContent[] = React.useMemo(() => {
        if (!controller.topLevelInitDone) return []
        return FieldContentUtils.getInstance().getAllBy("cardId", card.id)
    }, [card, newCardController.states.showState.val, editCardController.states.showState.val, cardTypesController.states.showState.val])

    function handleClickRow(event: React.MouseEvent<HTMLElement>) {
        if ((event.ctrlKey && event.button === 0) || (event.metaKey && event.button === 0)) {
            controller.onToggleSelectViewEntity({
                viewItem: card,
                setAsAnchorEl: controller.states.selectedEntitiesState.val.length === 0
            })
        } else if (event.target instanceof HTMLDivElement) {
            controller.onToggleSelectViewEntity({
                viewItem: card,
                singleSelect: true,
                setAsAnchorEl: true
            })
        }
    }

    if (fieldContents.length < 2) {
        return <KartAIBox flexSpaceBetween sx={cardRow(Boolean(selected), "paused")} id={"row-" + card.id}
                          onClick={handleClickRow}>
            <Typography>{StaticText.INVALID_CARD_INFO}</Typography>
            <OutlinedIconButton onClick={actions.onDelete}>
                <Delete/>
            </OutlinedIconButton>

        </KartAIBox>
    }


    return <KartAIBox>
        <CardItemMenu
            controller={controller}
            card={card}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            entitiesSelected={controller.entitiesSelected()}
            menuFunctions={actions}
        />

        <KartAIBox id={"row-" + card.id} onClick={handleClickRow}
                   sx={cardRow(Boolean(selected), CardUtils.getCardStatus(card))}
                   flexSpaceBetween>
            <KartAIBox flexSpaceBetween sx={{width: "80%"}}>
                {fieldContents.map((fieldContent, index) => {
                    return <Tooltip key={fieldContent.id} title={fieldContent.content}>
                        <Typography sx={fieldContentStyle(fieldContents.length)} mr={5}
                        >{fieldContent.content}</Typography>
                    </Tooltip>
                })}
            </KartAIBox>

            <KartAIBox>
                <KartAIBox sx={{display: "inline-block"}}>
                    <OutlinedIconButton onClick={e => setAnchorEl(e.currentTarget)}>
                        <Edit/>
                    </OutlinedIconButton>
                </KartAIBox>
            </KartAIBox>
        </KartAIBox>
    </KartAIBox>

}