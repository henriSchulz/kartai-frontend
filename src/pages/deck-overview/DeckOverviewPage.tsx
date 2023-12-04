import {useGlobalContext} from "../../App";
import Directory from "../../types/dbmodel/Directory";
import {DeckOrDirectory} from "../../types/DeckOrDirectory";
import React, {useContext, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/reduxUtils";
import KartAIBox from "../../components/ui/KartAIBox";
import ListView from "../../components/list-view/ListView";
import ListViewHead from "../../components/list-view/ListViewHead";
import {Add, CloudUpload, Folder, FolderOutlined, Notes, School, TableRowsOutlined} from "@mui/icons-material";
import {StaticText} from "../../data/text/staticText";
import {ClickAwayListener, Divider} from "@mui/material";
import {lightBorderColor} from "../../styles/root";
import KartAIContainer from "../../components/ui/KartAIContainer";
import PageTransitionWrapper from "../../components/animation/PageTransitionWrapper";
import ListViewContent from "../../components/list-view/ListViewContent";
import DeckOverviewController from "./DeckOverviewController";
import Context from "../../types/Context";
import DeckOverviewItem from "./components/DeckOverviewItem";
import ContextMenu from "../../types/ContextMenu";
import NewDeckOrDirectoryController from "./features/new-deck-or-directory/NewDeckOrDirectoryController";
import NewDeckOrDirectoryModal from "./features/new-deck-or-directory/NewDeckOrDirectoryModal";
import RenameDeckOrDirectoryController from "./features/rename-deck-or-directory/RenameDeckOrDirectoryController";
import RenameDeckOrDirectoryModal from "./features/rename-deck-or-directory/RenameDeckOrDirectoryModal";
import DeleteDeckOrDirectoryController from "./features/delete-deck-or-directory/DeleteDeckOrDirectoryController";
import DeleteDeckOrDirectoryModal from "./features/delete-deck-or-directory/DeleteDeckOrDirectoryModal";
import KartAIInfoText from "../../components/ui/KartAIInfoText";
import DeckOrDirectoryInformationController
    from "./features/deck-or-directory-information/DeckOrDirectoryInformationController";
import DeckOrDirectoryInformationModal from "./features/deck-or-directory-information/DeckOrDirectoryInformationModal";
import ExportDeckOrDirectoryController from "./features/export-deck-or-directory/ExportDeckOrDirectoryController";
import ExportDeckOrDirectoryModal from "./features/export-deck-or-directory/ExportDeckOrDirectoryModal";
import ShareDeckOrDirectoryController from "./features/share-deck-or-directory/ShareDeckOrDirectoryController";
import ShareDeckOrDirectoryModal from "./features/share-deck-or-directory/ShareDeckOrDirectoryModal";
import MoveDeckOrDirectoryController from "./features/move-deck-or-directory/MoveDeckOrDirectoryController";
import MoveDeckOrDirectoryModal from "./features/move-deck-or-directory/MoveDeckOrDirectoryModal";
import DirectoryUtils from "../../utils/DirectoryUtils";
import KartAIButton from "../../components/ui/KartAIButton";
import KartAIItemMenu, {ItemMenuItem} from "../../components/KartAIItemMenu";
import KartAIPopperMenu from "../../components/KartAIPopperMenu";
import InvisibleFileSelector from "../../components/InvisibleFileSelector";
import {useNavigate, useParams} from "react-router-dom";
import ImportCSVController from "./features/import-csv/ImportCSVController";
import ImportCSVModal from "./features/import-csv/ImportCSVModal";


export default function () {

    const {id: currentDirectoryId} = useParams()

    const navigate = useNavigate()

    const {snackbar, topLevelInitDone, loadingBackdrop} = useGlobalContext()

    const [initDone, setInitDone] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [currentDirectory, setCurrentDirectory] = React.useState<Directory | null>(null)
    const [tempSelectedDeckOrDirectory, setTempSelectedDeckOrDirectory] = React.useState<DeckOrDirectory | null>(null)
    const [selectedDecksOrDirectories, setSelectedDecksOrDirectories] = React.useState<DeckOrDirectory[]>([])
    const [selectedDecksOrDirectoriesAnchorEl, setSelectedDecksOrDirectoriesAnchorEl] = React.useState<null | DeckOrDirectory>(null)
    const [isCreatingDeck, setIsCreatingDeck] = React.useState(false)

    const [showNewDeckOrDirectoryModal, setShowNewDeckOrDirectoryModal] = React.useState(false)
    const [showRenameDeckOrDirectoryModal, setShowRenameDeckOrDirectoryModal] = React.useState(false)
    const [showDeleteDeckOrDirectoryModal, setShowDeleteDeckOrDirectoryModal] = React.useState(false)
    const [showDeckOrDirectoryInformationModal, setShowDeckOrDirectoryInformationModal] = React.useState(false)
    const [showExportDeckOrDirectoryModal, setShowExportDeckOrDirectoryModal] = React.useState(false)
    const [showShareDeckOrDirectoryModal, setShowShareDeckOrDirectoryModal] = React.useState(false)
    const [showMoveDeckOrDirectoryModal, setShowMoveDeckOrDirectoryModal] = React.useState(false)
    const [showImportCsvModal, setShowImportCsvModal] = React.useState(false)

    const [selectedExportFormat, setSelectedExportFormat] = React.useState<"csv" | "kpkg">("kpkg")
    const [csvDelimiter, setCsvDelimiter] = React.useState("\t")
    const [selectedDestinationDirectoryId, setSelectedDestinationDirectoryId] = React.useState<string>("")
    const [csvFileText, setCsvFileText] = useState("")
    const [activeCsvImportStep, setActiveCsvImportStep] = useState(0)
    const [parsedCsvData, setParsedCsvData] = useState<string[][]>([])
    const [fieldsChoice, setFieldsChoice] = useState<Record<number, string>>({})
    const [selectedDestinationDeckId, setSelectedDestinationDeckId] = useState<string>("")
    const [selectedCardTypeId, setSelectedCardTypeId] = useState<string>("")

    const [contextMenu, setContextMenu] = React.useState<ContextMenu>(DeckOverviewController.initialContextMenuState)

    const [addMenuAnchorEl, setAddMenuAnchorEl] = React.useState<null | HTMLElement>(null)
    const [importMenuAnchorEl, setImportMenuAnchorEl] = React.useState<null | HTMLElement>(null)

    const controller = new DeckOverviewController({
        states: {
            importMenuAnchorElState: {val: importMenuAnchorEl, set: setImportMenuAnchorEl},
            addMenuAnchorElState: {val: addMenuAnchorEl, set: setAddMenuAnchorEl},
            tempDeckOrDirectoryState: {val: tempSelectedDeckOrDirectory, set: setTempSelectedDeckOrDirectory},
            selectedEntitiesState: {val: selectedDecksOrDirectories, set: setSelectedDecksOrDirectories},
            contextMenuState: {val: contextMenu, set: setContextMenu},
            currentDirectoryState: {val: currentDirectory, set: setCurrentDirectory},
            selectedEntitiesAnchorElState: {
                val: selectedDecksOrDirectoriesAnchorEl,
                set: setSelectedDecksOrDirectoriesAnchorEl
            },
            loadingState: {val: loading, set: setLoading},
        },
        snackbar, loadingBackdrop, topLevelInitDone
    })

    const newDeckOrDirectoryController = new NewDeckOrDirectoryController({
        deckOverviewController: controller,
        states: {
            showState: {val: showNewDeckOrDirectoryModal, set: setShowNewDeckOrDirectoryModal},
            isCreatingDeckState: {val: isCreatingDeck, set: setIsCreatingDeck},

        },
        snackbar,
    })

    const renameDeckOrDirectoryController = new RenameDeckOrDirectoryController({
        deckOverviewController: controller,
        states: {
            showState: {
                val: showRenameDeckOrDirectoryModal,
                set: setShowRenameDeckOrDirectoryModal
            },
        },
        snackbar
    })

    const deleteDeckOrDirectoryController = new DeleteDeckOrDirectoryController({
        snackbar, deckOverviewController: controller, states: {
            showState: {
                val: showDeleteDeckOrDirectoryModal,
                set: setShowDeleteDeckOrDirectoryModal
            }
        }
    })

    const deckOrDirectoryInformationController = new DeckOrDirectoryInformationController({
        deckOverviewController: controller,
        states: {
            showState: {
                val: showDeckOrDirectoryInformationModal,
                set: setShowDeckOrDirectoryInformationModal
            }
        },
        snackbar
    })

    const exportDeckOrDirectoryController = new ExportDeckOrDirectoryController({
        states: {
            showState: {
                val: showExportDeckOrDirectoryModal,
                set: setShowExportDeckOrDirectoryModal
            },
            selectedExportFormatState: {
                val: selectedExportFormat,
                set: setSelectedExportFormat
            },
            csvDelimiterState: {
                val: csvDelimiter,
                set: setCsvDelimiter
            }
        },
        snackbar, deckOverviewController: controller
    })

    const shareDeckOrDirectoryController = new ShareDeckOrDirectoryController({
        states: {
            showState: {
                val: showShareDeckOrDirectoryModal,
                set: setShowShareDeckOrDirectoryModal
            }
        },
        snackbar, deckOverviewController: controller
    })

    const moveDeckOrDirectoryController = new MoveDeckOrDirectoryController({
        states: {
            selectedDestinationDirectoryIdState: {
                val: selectedDestinationDirectoryId,
                set: setSelectedDestinationDirectoryId
            },
            showState: {
                val: showMoveDeckOrDirectoryModal,
                set: setShowMoveDeckOrDirectoryModal
            }
        },
        snackbar, deckOverviewController: controller
    })

    const importCSVController = new ImportCSVController({
        snackbar,
        deckOverviewController: controller,
        newDeckOrDirectoryController,
        states: {
            showState: {val: showImportCsvModal, set: setShowImportCsvModal},
            csvFileTextState: {val: csvFileText, set: setCsvFileText},
            activeCsvImportStepState: {val: activeCsvImportStep, set: setActiveCsvImportStep},
            parsedCsvState: {val: parsedCsvData, set: setParsedCsvData},
            fieldsChoiceState: {val: fieldsChoice, set: setFieldsChoice},
            selectedCardTypeIdState: {val: selectedCardTypeId, set: setSelectedCardTypeId},
            selectedDestinationDeckIdState: {val: selectedDestinationDeckId, set: setSelectedDestinationDeckId},
            csvDelimiterState: {val: csvDelimiter, set: setCsvDelimiter},
        }
    })

    const decks = useAppSelector(state => state.decks.value)
    const directories = useAppSelector(state => state.directories.value)

    const deckOverviewItems: DeckOrDirectory[] = React.useMemo(() => {
        if (!decks || !directories) return []

        return controller.toDeckOverviewItems(
            Array.from(directories.values()),
            Array.from(decks.values())
        )
    }, [initDone, decks, directories])

    const currentDirectoryPath: Directory[] = React.useMemo(() => {
        return DirectoryUtils.getInstance().getParentDirectoriesPath(currentDirectory?.id)
    }, [initDone, currentDirectory])

    React.useEffect(() => {
        if (!topLevelInitDone) return


        if (currentDirectoryId) {
            try {
                const directory = DirectoryUtils.getInstance().getById(currentDirectoryId)
                setCurrentDirectory(directory)
            } catch (e) {
                navigate("/decks")
            }
        }

        setInitDone(true)
    }, [topLevelInitDone])


    React.useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                controller.onCloseContextMenu()
                event.preventDefault()
            }

            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                controller.onArrowKeySelection({
                    up: event.key === "ArrowUp",
                    shiftKey: event.shiftKey,
                    viewItems: deckOverviewItems,
                })
            }
        }

        window.addEventListener("keydown", handler)

        return () => window.removeEventListener("keydown", handler)

    }, [selectedDecksOrDirectoriesAnchorEl, selectedDecksOrDirectories, deckOverviewItems])


    const newDeckActionButton = {
        text: StaticText.NEW_DECK, onClick: () => {
            newDeckOrDirectoryController.open(true)
        },
        icon: <Add/>
    }

    const learnFolderActionButton = {
        text: StaticText.LEARN_FOLDER, onClick: () => {
        },
        icon: <School/>
    }

    const addMenuItems: ItemMenuItem[] = [
        {
            text: StaticText.ADD_DECK,
            icon: <Notes/>, onClick() {
                newDeckOrDirectoryController.open(true)
            }
        }, {
            text: StaticText.ADD_FOLDER,
            icon: <Folder/>,
            onClick() {
                newDeckOrDirectoryController.open(false)
            }
        }
    ]

    const importMenuItems: ItemMenuItem[] = [
        {
            text: StaticText.KARTAI_DECK_PACKAGE,
            icon: <Notes/>, onClick() {
                controller.onOpenKpkgFileSelector()
            }
        }, {
            text: StaticText.CSV_FORMAT,
            icon: <TableRowsOutlined/>,
            onClick() {
                controller.onOpenCsvFileSelector()
            }
        }
    ]


    return <KartAIBox>


        {showNewDeckOrDirectoryModal && <NewDeckOrDirectoryModal controller={newDeckOrDirectoryController}/>}
        {showRenameDeckOrDirectoryModal && <RenameDeckOrDirectoryModal controller={renameDeckOrDirectoryController}/>}
        {showDeleteDeckOrDirectoryModal && <DeleteDeckOrDirectoryModal controller={deleteDeckOrDirectoryController}/>}
        {showDeckOrDirectoryInformationModal &&
            <DeckOrDirectoryInformationModal controller={deckOrDirectoryInformationController}/>}
        {showExportDeckOrDirectoryModal && <ExportDeckOrDirectoryModal controller={exportDeckOrDirectoryController}/>}
        {showShareDeckOrDirectoryModal && <ShareDeckOrDirectoryModal controller={shareDeckOrDirectoryController}/>}
        {showMoveDeckOrDirectoryModal && <MoveDeckOrDirectoryModal controller={moveDeckOrDirectoryController}/>}
        {showImportCsvModal && <ImportCSVModal controller={importCSVController}/>}


        <PageTransitionWrapper>
            <KartAIContainer>
                <ListView>
                    <ListViewHead loading={!initDone} title={
                        currentDirectory ? currentDirectory.name : StaticText.DECK_VIEW
                    } icon={
                        currentDirectory ? <Folder/> : <Notes/>
                    } breadcrumbs={currentDirectoryPath} rightActionButton={
                        currentDirectory ? learnFolderActionButton : newDeckActionButton
                    }/>
                    <Divider sx={{color: lightBorderColor, mb: 3}}/>

                    <ListViewContent fullHeight>

                        <KartAIInfoText text={currentDirectory ? StaticText.EMPTY_FOLDER : StaticText.NO_DECKS}
                                        show={deckOverviewItems.length === 0 && topLevelInitDone}/>

                        {deckOverviewItems.map((deckOrDirectory, index) => {
                            return <DeckOverviewItem
                                controller={controller}
                                importCsvController={importCSVController}
                                deckOrDir={deckOrDirectory}
                                key={index}
                                selected={selectedDecksOrDirectories.some(item => item.id === deckOrDirectory.id)}
                                actions={{
                                    onRename: () => {
                                        renameDeckOrDirectoryController.open(deckOrDirectory)
                                    },
                                    onDelete() {
                                        deleteDeckOrDirectoryController.open(deckOrDirectory)
                                    },
                                    onInfo() {
                                        deckOrDirectoryInformationController.open(deckOrDirectory)
                                    },
                                    onExport() {
                                        exportDeckOrDirectoryController.open(deckOrDirectory)
                                    },
                                    onShare() {
                                        shareDeckOrDirectoryController.open(deckOrDirectory)
                                    },
                                    onMove() {
                                        moveDeckOrDirectoryController.open(deckOrDirectory)
                                    },
                                }}
                            />
                        })}

                    </ListViewContent>
                </ListView>

                <KartAIBox mt={-2.5}>
                    <KartAIButton startIcon={<Add/>}
                                  variant="contained"
                                  color="secondary"
                                  onClick={controller.openAddMenu}
                    >{StaticText.ADD}</KartAIButton>
                    <KartAIPopperMenu
                        show={Boolean(addMenuAnchorEl)}
                        anchorEl={addMenuAnchorEl}
                        onClose={controller.closeAddMenu}
                        menuItems={addMenuItems}
                    />
                    <KartAIButton ml={2} startIcon={<CloudUpload/>}
                                  variant="contained"
                                  color="secondary"
                                  onClick={controller.openImportMenu}
                    >{StaticText.IMPORT}</KartAIButton>
                    <KartAIPopperMenu
                        show={Boolean(importMenuAnchorEl)}
                        anchorEl={importMenuAnchorEl}
                        onClose={controller.closeImportMenu}
                        menuItems={importMenuItems}
                    />
                    <InvisibleFileSelector onFileSelected={controller.onUploadKpkgFile}
                                           id={controller.kpkgFileSelectorId}
                                           accept=".kpkg"/>
                    <InvisibleFileSelector
                        id={controller.csvFileSelectorId}
                        accept=".csv"
                        onFileSelected={importCSVController.onSelectCsvFile}
                    />

                </KartAIBox>
            </KartAIContainer>
        </PageTransitionWrapper>
    </KartAIBox>

}