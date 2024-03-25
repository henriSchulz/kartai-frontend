import KartAIBox from "../../components/ui/KartAIBox";
import PageTransitionWrapper from "../../components/animation/PageTransitionWrapper";
import KartAIContainer from "../../components/ui/KartAIContainer";
import ListView from "../../components/list-view/ListView";
import ListViewHead from "../../components/list-view/ListViewHead";
import Deck from "../../types/dbmodel/Deck";
import React, {useState} from "react";
import Directory from "../../types/dbmodel/Directory";
import DirectoryUtils from "../../utils/DirectoryUtils";
import {Add, AutoAwesome, Notes, School} from "@mui/icons-material";
import {useGlobalContext} from "../../App";
import {useNavigate, useParams} from "react-router-dom";
import DeckUtils from "../../utils/DeckUtils";
import {ClickAwayListener, Divider, Pagination, Typography} from "@mui/material";
import ListViewContent from "../../components/list-view/ListViewContent";
import {useAppSelector} from "../../hooks/reduxUtils";
import CardsController from "./CardsController";
import Card from "../../types/dbmodel/Card";
import {StaticText} from "../../data/text/staticText";
import CardItem from "./commponents/CardItem";
import DeleteCardController from "./features/delete-card/DeleteCardController";
import DeleteCardModal from "./features/delete-card/DeleteCardModal";
import NewCardController from "./features/new-card/NewCardController";
import KartAIButton from "../../components/ui/KartAIButton";
import NewCardModal from "./features/new-card/NewCardModal";
import EditCardController from "./features/edit-card/EditCardController";
import EditCardModal from "./features/edit-card/EditCardModal";
import CardInformationController from "./features/card-information/CardInformationController";
import CardInformationModal from "./features/card-information/CardInformationModal";
import PauseContinueCardController from "./features/pause-continue-card/PauseContinueCardController";
import PauseContinueCardModal from "./features/pause-continue-card/PauseContinueCardModal";
import ResetCardController from "./features/reset-card/ResetCardController";
import ResetCardModal from "./features/reset-card/ResetCardModal";
import MoveCardController from "./features/move-card/MoveCardController";
import MoveCardModal from "./features/move-card/MoveCardModal";
import ChangeCardTypeController from "./features/change-card-type/ChangeCardTypeController";
import ChangeCardTypeModal from "./features/change-card-type/ChangeCardTypeModal";
import KartAIInfoText from "../../components/ui/KartAIInfoText";
import {isXsWindow} from "../../utils/general";
import KartAISelect from "../../components/ui/KartAISelect";
import GenerateCardsController from "./features/generate-cards/GenerateCardsController";
import GenerateCardsModal from "./features/generate-cards/GenerateCardsModal";
import OpenaiApiService from "../../services/OpenaiApiService";
import CardTypeUtils from "../../utils/CardTypeUtils";
import FieldContent from "../../types/dbmodel/FieldContent";
import CardPreviewController from "./features/card-preview/CardPreviewController";
import CardPreviewModal from "./features/card-preview/CardPreviewModal";

export default function () {

    const {topLevelInitDone, snackbar, cardTypesController} = useGlobalContext()

    const {id: deckId} = useParams()

    const navigate = useNavigate()

    const [initDone, setInitDone] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedCards, setSelectedCards] = useState<Card[]>([])
    const [selectedCardsAnchorEl, setSelectedCardsAnchorEl] = useState<Card | null>(null)
    const [deck, setDeck] = useState<Deck | null>(null)
    const [tempSelectedCard, setTempSelectedCard] = useState<Card | null>(null)
    const [selectedCardTypeID, setSelectedCardTypeId] = useState<string>("")
    const [selectedDestinationDeckId, setSelectedDestinationDeckId] = useState<string>("")
    const [isPausing, setIsPausing] = useState(false)
    const [fieldChoice, setFieldChoice] = useState<Record<string, string>>({})
    const [currentPage, setCurrentPage] = useState(1)
    const [maxItemsPerPage, setMaxItemsPerPage] = useState(CardsController.MAX_ITEMS_PER_PAGE)
    const [activeCardGenerationStep, setActiveCardGenerationStep] = useState<number>(0)
    const [cardGenerationInputText, setCardGenerationInputText] = useState<string>("")
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [generatedCards, setGeneratedCards] = useState<Card[]>([])
    const [generatedFieldContents, setGeneratedFieldContents] = useState<FieldContent[]>([])
    const [currentTemplateState, setCurrentTemplateState] = useState<"front" | "back">("front")


    const [showDeleteCardModal, setShowDeleteCardModal] = useState(false)
    const [showNewCardModal, setShowNewCardModal] = useState(false)
    const [showEditCardModal, setShowEditCardModal] = useState(false)
    const [showCardInformationModal, setShowCardInformationModal] = useState(false)
    const [showPauseContinueCardModal, setShowPauseContinueCardModal] = useState(false)
    const [showResetCardModal, setShowResetCardModal] = useState(false)
    const [showMoveCardModal, setShowMoveCardModal] = useState(false)
    const [showChangeCardTypeModal, setShowChangeCardTypeModal] = useState(false)
    const [showGenerateCardsModal, setShowGenerateCardsModal] = useState(false)
    const [showPreviewCardModal, setShowPreviewCardModal] = useState(false)


    const isModalOpen = showDeleteCardModal || showNewCardModal || showEditCardModal || showCardInformationModal || showPauseContinueCardModal || showResetCardModal || showMoveCardModal || showChangeCardTypeModal || showGenerateCardsModal


    const cards = useAppSelector(state => state.cards.value)

    const controller = new CardsController({
        deckId,
        snackbar, topLevelInitDone, states: {
            tempSelectedCardState: {val: tempSelectedCard, set: setTempSelectedCard},
            initDoneState: {val: initDone, set: setInitDone},
            selectedEntitiesState: {val: selectedCards, set: setSelectedCards},
            selectedEntitiesAnchorElState: {val: selectedCardsAnchorEl, set: setSelectedCardsAnchorEl},
            deckState: {val: deck, set: setDeck},
            currentPageState: {val: currentPage, set: setCurrentPage},
            maxItemsPerPageState: {val: maxItemsPerPage, set: setMaxItemsPerPage},
        }
    })

    const decksCards = React.useMemo(() => Array.from(cards.values()).filter(card => card.deckId === deckId), [cards])

    const cardViewItems = React.useMemo(() => controller.toCardViewItems(Array.from(cards.values()), true),
        [cards, currentPage, topLevelInitDone, maxItemsPerPage, cardTypesController.states.showState.val])

    const currentDirectoryPath: Directory[] = React.useMemo(() => {
        if (!initDone || !deck) return []
        return DirectoryUtils.getInstance().getParentDirectoriesPath(deck?.parentId, true)
    }, [initDone])


    const deleteCardController = new DeleteCardController({
        snackbar, cardsController: controller, states: {
            showState: {val: showDeleteCardModal, set: setShowDeleteCardModal}
        }
    })

    const newCardController = new NewCardController({
        snackbar, cardsController: controller, states: {
            showState: {val: showNewCardModal, set: setShowNewCardModal},
            selectedCardTypeIdState: {val: selectedCardTypeID, set: setSelectedCardTypeId}
        }
    })

    const editCardController = new EditCardController({
        snackbar, card: tempSelectedCard, states: {
            showState: {val: showEditCardModal, set: setShowEditCardModal},
        }
    })

    const cardInformationController = new CardInformationController({
        snackbar, cardsController: controller, states: {
            showState: {val: showCardInformationModal, set: setShowCardInformationModal},
        }
    })

    const pauseContinueCardController = new PauseContinueCardController({
        snackbar, cardsController: controller, states: {
            showState: {val: showPauseContinueCardModal, set: setShowPauseContinueCardModal},
            isPausingState: {val: isPausing, set: setIsPausing}
        }
    })

    const resetCardController = new ResetCardController({
        snackbar, cardsController: controller, states: {
            showState: {val: showResetCardModal, set: setShowResetCardModal},
        }
    })

    const moveCardController = new MoveCardController({
        snackbar, cardsController: controller, states: {
            showState: {val: showMoveCardModal, set: setShowMoveCardModal},
            selectedDestinationDeckIdState: {val: selectedDestinationDeckId, set: setSelectedDestinationDeckId}
        }
    })

    const changeCardTypeController = new ChangeCardTypeController({
        snackbar, cardsController: controller, states: {
            showState: {val: showChangeCardTypeModal, set: setShowChangeCardTypeModal},
            selectedCardTypeIdState: {val: selectedDestinationDeckId, set: setSelectedDestinationDeckId},
            fieldsChoiceState: {val: fieldChoice, set: setFieldChoice}
        }
    })

    const generateCardsController = new GenerateCardsController({
        snackbar, cardsController: controller, states: {
            showState: {val: showGenerateCardsModal, set: setShowGenerateCardsModal},
            selectedCardTypeIdState: {val: selectedCardTypeID, set: setSelectedCardTypeId},
            loadingState: {val: loading, set: setLoading},
            activeGenerateCardsStepState: {val: activeCardGenerationStep, set: setActiveCardGenerationStep},
            cardGenerationInputTextState: {val: cardGenerationInputText, set: setCardGenerationInputText},
            uploadedFileState: {val: uploadedFile, set: setUploadedFile},
            generatedCardsState: {val: generatedCards, set: setGeneratedCards},
            generatedFieldContentsState: {val: generatedFieldContents, set: setGeneratedFieldContents}
        }
    })

    const previewCardController = new CardPreviewController({
        snackbar, cardsController: controller, states: {
            showState: {val: showPreviewCardModal, set: setShowPreviewCardModal},
            currentTemplateState: {val: currentTemplateState, set: setCurrentTemplateState}
        }
    })


    React.useEffect(() => {


        if (!topLevelInitDone || !deckId) return

        if (!DeckUtils.getInstance().has(deckId)) {
            return navigate('/deck-overview')
        }

        setDeck(DeckUtils.getInstance().getById(deckId!))
        setInitDone(true)
    }, [topLevelInitDone])

    React.useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (isModalOpen) return
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                controller.onArrowKeySelection({
                    up: event.key === "ArrowUp",
                    shiftKey: event.shiftKey,
                    viewItems: cardViewItems,
                })
            }
        }
        window.addEventListener("keydown", handler)

        return () => window.removeEventListener("keydown", handler)

    }, [cardViewItems, selectedCards, selectedCardsAnchorEl, isModalOpen])

    React.useEffect(() => {
        const keyboardShortcuts = {
            "Backspace": () => {
                if (selectedCards.length > 0) {
                    deleteCardController.open(selectedCards[0])
                }
            },
            "a": () => {
                setSelectedCards(cardViewItems)
            }
        }

        const handler = controller.getOnKeyboardShortcut(keyboardShortcuts, isModalOpen)


        window.addEventListener("keydown", handler)

        return () => window.removeEventListener("keydown", handler)

    }, [selectedCards, cardViewItems, isModalOpen])


    const studyDeckButton = {
        text: StaticText.LEARN_DECK,
        icon: <School/>,
        onClick() {
            navigate("/deck/" + deckId)
        }
    }

    function getRowsPerPageOptions() {
        const rowsPerPageOptions = []
        rowsPerPageOptions.push(CardsController.MAX_ITEMS_PER_PAGE)
        if (decksCards.length > 10) rowsPerPageOptions.push(25)
        if (decksCards.length > 25) rowsPerPageOptions.push(50)
        if (decksCards.length > 50) rowsPerPageOptions.push(100)
        return rowsPerPageOptions.map(val => ({
            value: val.toString(),
            label: val.toString()
        }))
    }


    return <KartAIBox>

        {showDeleteCardModal && <DeleteCardModal controller={deleteCardController}/>}
        {showNewCardModal && <NewCardModal controller={newCardController}/>}
        {showEditCardModal && <EditCardModal controller={editCardController}/>}
        {showCardInformationModal && <CardInformationModal controller={cardInformationController}/>}
        {showPauseContinueCardModal && <PauseContinueCardModal controller={pauseContinueCardController}/>}
        {showResetCardModal && <ResetCardModal controller={resetCardController}/>}
        {showMoveCardModal && <MoveCardModal controller={moveCardController}/>}
        {showChangeCardTypeModal && <ChangeCardTypeModal controller={changeCardTypeController}/>}
        {showGenerateCardsModal && <GenerateCardsModal controller={generateCardsController}/>}
        {showPreviewCardModal && <CardPreviewModal controller={previewCardController}/>}


        <PageTransitionWrapper>
            <KartAIContainer>


                <ListView>
                    <ListViewHead
                        loading={!initDone}
                        title={deck?.name}
                        breadcrumbs={currentDirectoryPath}
                        icon={<Notes/>}
                        rightActionButton={studyDeckButton}
                    />
                    <Divider/>
                    <ClickAwayListener onClickAway={() => setSelectedCards([])}>
                        <div>
                            <ListViewContent spacing={1}>

                                <KartAIInfoText text={StaticText.NO_CARDS}
                                                show={decksCards.length === 0 && topLevelInitDone}/>

                                {cardViewItems.map((card, index) => {
                                    return <CardItem
                                        key={card.id}
                                        card={card}
                                        controller={controller}
                                        newCardController={newCardController}
                                        editCardController={editCardController}
                                        selected={selectedCards.some(selectedCard => selectedCard.id === card.id)}
                                        actions={{
                                            onDelete() {
                                                deleteCardController.open(card)
                                            },
                                            onInfo() {
                                                cardInformationController.open(card)
                                            },
                                            onMove() {
                                                moveCardController.open(card)
                                            },
                                            onReset() {
                                                resetCardController.open(card)
                                            },
                                            onPause() {
                                                pauseContinueCardController.open(card, true)
                                            },
                                            onContinue() {
                                                pauseContinueCardController.open(card, false)
                                            },
                                            onEdit() {
                                                setTempSelectedCard(card)
                                                editCardController.open()
                                            },
                                            onPreview() {
                                                previewCardController.open(card)
                                            },
                                            onChangeCardType() {
                                                changeCardTypeController.open(card)
                                            }
                                        }}
                                    />
                                })}
                            </ListViewContent>
                        </div>
                    </ClickAwayListener>

                    <KartAIBox hide={cards.size < CardsController.MAX_ITEMS_PER_PAGE} gridCenter mt={5}>
                        <KartAIBox flexSpaceBetween fullWidth>
                            <KartAIBox hideIfXs>
                                <Typography sx={{mr: 2, visibility: selectedCards.length > 0 ? "unset" : "hidden"}}>
                                    {(selectedCards.length === 1 ? StaticText.CARD_SELECTED : StaticText.CARDS_SELECTED.replaceAll("{cards}", selectedCards.length.toString()))}
                                </Typography>
                            </KartAIBox>

                            <Pagination onChange={(_, number) => {
                                setSelectedCards([])
                                setCurrentPage(number)
                            }}
                                        count={Math.ceil(decksCards.length / maxItemsPerPage)}
                                        siblingCount={isXsWindow() ? 0 : 1}
                                        boundaryCount={isXsWindow() ? 0 : 1}
                                        shape="rounded" variant="outlined" color="primary"/>

                            <KartAIBox flexCenter ml={2}>
                                <Typography sx={{mr: 1}}>{StaticText.ROWS_PER_PAGE}:</Typography>
                                <KartAISelect variant="standard" value={maxItemsPerPage.toString()}
                                              onChange={(e: string) => {
                                                  const val = Number(e)
                                                  const newPageCount = Math.round(decksCards.length / val)
                                                  if (newPageCount < currentPage) {
                                                      setCurrentPage(newPageCount)
                                                  }
                                                  setMaxItemsPerPage(val)
                                              }} size="small"
                                              options={getRowsPerPageOptions()}
                                />
                            </KartAIBox>

                        </KartAIBox>
                    </KartAIBox>

                </ListView>

                <KartAIBox mt={2}>
                    <KartAIButton startIcon={<Add/>}
                                  variant="contained"
                                  color="secondary"
                                  onClick={newCardController.open}
                    >{StaticText.ADD}</KartAIButton>
                    <KartAIButton ml={2} startIcon={<AutoAwesome/>}
                                  variant="contained"
                                  color="secondary"
                                  onClick={generateCardsController.open}
                    >{StaticText.GENERATE_CARDS}</KartAIButton>
                </KartAIBox>
            </KartAIContainer>
        </PageTransitionWrapper>


    </KartAIBox>
}