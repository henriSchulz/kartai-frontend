import React from "react";


import {Button, Tooltip, Typography} from "@mui/material";
import {Folder, Notes, Tune} from "@mui/icons-material";
import {DeckOrDirectory} from "../../../types/DeckOrDirectory";
import {getWindowWidth, isXsWindow, windowWidthGreaterThan} from "../../../utils/general";
import CardUtils from "../../../utils/CardUtils";
import {StaticText} from "../../../data/text/staticText";
import OutlinedIconButton from "../../../components/OutlinedIconButton";
import DeckOverviewItemMenu from "./DeckOverviewItemMenu";
import KartAIBox from "../../../components/ui/KartAIBox";
import {row} from "../../../styles/listView";
import {
    deckOverviewCardsCount,
    deckOverviewItemTitle,
    deckOverviewItemTitleButton
} from "../styles/deckOverviewPageItem";
import {useNavigate} from "react-router-dom";
import DeckOverviewController from "../DeckOverviewController";
import ImportCSVController from "../features/import-csv/ImportCSVController";
import ImportCraftTableController from "../features/import-craft-table/ImportCraftTableController";
import {useGlobalContext} from "../../../App";


interface DeckListItemProps {
    deckOrDir: DeckOrDirectory
    selected?: boolean
    controller: DeckOverviewController
    actions: {
        onRename(): void
        onDelete(): void
        onExport(): void
        onInfo(): void
        onMove(): void
        onShare(): void
    },
    importCsvController: ImportCSVController
    importCraftTableController: ImportCraftTableController
}


function DeckOverviewItem(props: DeckListItemProps) {
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const {cardTypesController} = useGlobalContext()

    const {controller} = props

    const cardsInfo = React.useMemo(() => {
        if (props.deckOrDir.isDirectory) {
            return new CardUtils().getCardLearningStatesByDirectoryId(props.deckOrDir.id)
        } else {
            return new CardUtils().getCardLearningStatesByDeckId(props.deckOrDir.id)
        }
    }, [props.deckOrDir,
        props.importCsvController.states.showState.val,
        props.importCraftTableController.states.showState.val,
        cardTypesController.states.showState.val
    ])

    const openDeckOrDir = React.useCallback(() => {
        if (props.deckOrDir.isDirectory) {
            navigate(`/folder/${props.deckOrDir.id}`)
        } else {
            if (CardUtils.getInstance().getCardsByDeckId(props.deckOrDir.id).length === 0) {
                navigate(`/cards/${props.deckOrDir.id}`)
            } else {

                if (isXsWindow()) {
                    navigate(`/study/${props.deckOrDir.id}`)
                } else {
                    navigate(` / deck /${props.deckOrDir.id}`)
                }
            }
        }
    }, [props.deckOrDir])


    function cardsAvailable() {
        return cardsInfo.newCards + cardsInfo.reviewCards + cardsInfo.learningCards !== 0
    }

    function handleContextMenu(event: React.MouseEvent<HTMLDivElement>) {
        controller.onOpenContextMenu(event)
        controller.selectTempDeckOrDirectory(props.deckOrDir)
    }


    function handleClickRow(event: React.MouseEvent<HTMLElement>) {
        if (getWindowWidth() === "xs") {
            if (event.target instanceof HTMLDivElement) {
                openDeckOrDir()
            }

            return
        }
        if ((event.ctrlKey && event.button === 0) || (event.metaKey && event.button === 0)) {
            controller.onToggleSelectViewEntity({
                viewItem: props.deckOrDir,
                setAsAnchorEl: controller.states.selectedEntitiesState.val.length === 0
            })
        } else if (event.target instanceof HTMLDivElement) {
            controller.onToggleSelectViewEntity({
                viewItem: props.deckOrDir,
                singleSelect: true,
                setAsAnchorEl: true
            })
        }
    }


    return (<KartAIBox id={"row-" + props.deckOrDir.id}>
            {anchorEl && <DeckOverviewItemMenu
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                entitiesSelected={controller.entitiesSelected()}
                isShared={Boolean(props.deckOrDir.isShared)}
                menuFunctions={{
                    onRename: props.actions.onRename,
                    onDelete: props.actions.onDelete,
                    onExport: props.actions.onExport,
                    onInfo: props.actions.onInfo,
                    onMove: props.actions.onMove,
                    onShare: props.actions.onShare,
                }}
            />}

            <KartAIBox
                flexSpaceBetween
                sx={row(Boolean(props.selected))}
                onClick={handleClickRow}
                onContextMenu={handleContextMenu}
                onDoubleClick={openDeckOrDir}>

                <Button sx={deckOverviewItemTitleButton} startIcon={
                    props.deckOrDir.isDirectory ? <Folder fontSize="medium"/> : <Notes fontSize="medium"/>
                }
                        onClick={openDeckOrDir}>
                    <Typography variant="h5" sx={deckOverviewItemTitle}>
                        {props.deckOrDir.name}
                    </Typography>
                </Button>

                <KartAIBox flexCenter>
                    <KartAIBox hideIfXs flexCenter sx={{
                        display: {
                            xs: "none"
                        }, mx: 2
                    }}>
                        <Tooltip title={StaticText.NEW}>
                            <Typography
                                sx={deckOverviewCardsCount("new", !cardsAvailable())}>{cardsInfo.newCards}</Typography>
                        </Tooltip>

                        <Tooltip title={StaticText.LEARN}>
                            <Typography
                                sx={deckOverviewCardsCount("learning", !cardsAvailable())}>{cardsInfo.learningCards}</Typography>
                        </Tooltip>

                        <Tooltip title={StaticText.REVIEW}>
                            <Typography
                                sx={deckOverviewCardsCount("review", !cardsAvailable())}
                            >{cardsInfo.reviewCards}</Typography>
                        </Tooltip>
                    </KartAIBox>

                    <KartAIBox hide={windowWidthGreaterThan("xs")} flexCenter sx={{
                        display: {
                            xs: "none"
                        }, mx: 2
                    }}>
                        <Tooltip title={StaticText.CARDS}>
                            <Typography
                                sx={deckOverviewCardsCount("review", !cardsAvailable())}
                            >{cardsInfo.reviewCards + cardsInfo.learningCards + cardsInfo.newCards}</Typography>
                        </Tooltip>
                    </KartAIBox>


                    <KartAIBox hideIfXs sx={{display: "inline-block"}}>
                        <OutlinedIconButton onClick={event => setAnchorEl(event.currentTarget)}>
                            <Tune/>
                        </OutlinedIconButton>
                    </KartAIBox>

                </KartAIBox>
            </KartAIBox>

        </KartAIBox>

    )
}


export default DeckOverviewItem

