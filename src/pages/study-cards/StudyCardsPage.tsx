import KartAIBox from "../../components/ui/KartAIBox";
import {useNavigate, useParams} from "react-router-dom";
import StudyCardsController from "./StudyCardsController";
import {useGlobalContext} from "../../App";
import React, {useEffect, useMemo} from "react";
import PageTransitionWrapper from "../../components/animation/PageTransitionWrapper";
import {cardStyles, studyCardsPageCardsCount} from "./styles/studyCardsStyles";
import KartAIButton from "../../components/ui/KartAIButton";
import {StaticText} from "../../data/text/staticText";
import CardContent from "./components/CardContent";
import FieldContentUtils from "../../utils/FieldContentUtils";
import CardTypeVariantUtils from "../../utils/CardTypeVariantUtils";
import StudyCard from "../../types/StudyCard";
import {Divider, Typography} from "@mui/material";
import CardUtils from "../../utils/CardUtils";
import {mediumBoldText} from "../../styles/typography";
import {deckPageCardsCount} from "../deck/styles/deckPapeStyles";
import {useAppSelector} from "../../hooks/reduxUtils";
import DeckUtils from "../../utils/DeckUtils";
import DirectoryUtils from "../../utils/DirectoryUtils";
import {DeckOrDirectory} from "../../types/DeckOrDirectory";
import {EditNote, Folder, Notes} from "@mui/icons-material";
import KartAIContainer from "../../components/ui/KartAIContainer";
import {isXsWindow} from "../../utils/general";
import EditCardController from "../cards/features/edit-card/EditCardController";
import EditCardModal from "../cards/features/edit-card/EditCardModal";

export interface StudyCardsPage {
    customStudy?: boolean
}

export default function (props: StudyCardsPage) {

    const navigate = useNavigate()

    const {customStudy} = props

    const {snackbar, topLevelInitDone} = useGlobalContext()

    const {id} = useParams()


    const [studyCards, setStudyCards] = React.useState<StudyCard[]>([])
    const [initDone, setInitDone] = React.useState(false)
    const [backHidden, setBackHidden] = React.useState(true)
    const [showEditCardModal, setShowEditCardModal] = React.useState(false)

    const controller = new StudyCardsController({
        id: String(id), navigate, customStudy, snackbar, topLevelInitDone, states: {
            studyCardsState: {val: studyCards, set: setStudyCards},
            initDoneState: {val: initDone, set: setInitDone},
            backHiddenState: {val: backHidden, set: setBackHidden}
        }
    })

    const deckOrDirectory: DeckOrDirectory | null = useMemo(() => {
        if (!initDone) return null
        try {
            if (DeckUtils.getInstance().has(id)) {
                return {
                    isDirectory: false,
                    ...DeckUtils.getInstance().getById(id!)
                }
            } else {
                return {
                    isDirectory: true,
                    ...DirectoryUtils.getInstance().getById(id!)
                }
            }
        } catch (e) {
            return null
        }
    }, [id, initDone])

    const durationString = useMemo(controller.getNextLearningStateDueDurations, [studyCards])


    const currentStudyCardData = useMemo(() => {
        const currentStudyCard = controller.getCurrentStudyCard()

        if (!currentStudyCard) return {
            studyCard: null,
            fieldContentPairs: [],
            templateFront: "",
            templateBack: ""
        }

        const fieldContentPairs = FieldContentUtils.getInstance().getFieldContentPairs(currentStudyCard.card.id)

        const {
            templateFront,
            templateBack
        } = CardTypeVariantUtils.getInstance().get("cardTypeId", currentStudyCard.card.cardTypeId)


        return {
            studyCard: currentStudyCard,
            fieldContentPairs,
            templateFront,
            templateBack
        }

    }, [studyCards])


    const cardsInfo = useMemo(() => {
        const cardsInfo = {
            newCards: 0,
            learningCards: 0,
            reviewCards: 0,
        }

        if (!studyCards) return cardsInfo
        for (const studyCard of studyCards) {
            if (studyCard.card.paused) continue
            if (studyCard.card.dueAt > Date.now()) continue
            switch (CardUtils.getCardLevel(studyCard.card)) {
                case "new":
                    cardsInfo.newCards++
                    break
                case "learning":
                    cardsInfo.learningCards++
                    break
                case "review":
                    cardsInfo.reviewCards++
                    break
            }
        }
        return cardsInfo
    }, [studyCards])


    React.useEffect(() => {
        if (!topLevelInitDone) return
        if (controller.init()) {
            if (!initDone) setInitDone(true)
        } else {
            navigate("/deck/" + id)
        }
    }, [topLevelInitDone])


    React.useEffect(() => {
        if (!initDone) return
        if (showEditCardModal) return

        controller.refreshStudyCard(currentStudyCardData.studyCard!.card.id)

    }, [showEditCardModal])


    React.useEffect(() => {


        const keyboardShortcuts = {
            "1": () => controller.flipToFront(0),
            "2": () => controller.flipToFront(1),
            "3": () => controller.flipToFront(2),
            "4": () => controller.flipToFront(3),
            " ": () => {
                if (backHidden) controller.flipToBack()
                else controller.flipToFront(2)
            },
        }

        const handler = controller.getOnKeyboardShortcut(keyboardShortcuts, showEditCardModal)


        window.addEventListener("keydown", handler)

        return () => window.removeEventListener("keydown", handler)

    }, [backHidden, showEditCardModal, studyCards])

    const editCardController = new EditCardController({
        snackbar, states: {
            showState: {val: showEditCardModal, set: setShowEditCardModal}
        },
        card: currentStudyCardData.studyCard?.card ?? null
    })

    return <KartAIBox>

        {showEditCardModal && <EditCardModal controller={editCardController}/>}

        <PageTransitionWrapper>
            <KartAIContainer>
                <KartAIBox gridCenter>
                    <KartAIBox gridCenter styled sx={cardStyles}>

                        <KartAIBox fullWidth flexSpaceBetween>
                            <KartAIButton onClick={controller.navigateBack} startIcon={
                                deckOrDirectory?.isDirectory ? <Folder/> : <Notes/>
                            } variant="outlined" color="secondary">
                                {StaticText.BACK_TO.replaceAll("{name}", deckOrDirectory?.name ?? "")}
                            </KartAIButton>

                            <KartAIButton hideIfXs color="secondary" onClick={editCardController.open}
                                          variant="outlined" startIcon={<EditNote/>}>
                                {StaticText.EDIT}
                            </KartAIButton>
                        </KartAIBox>

                        <CardContent backHidden={backHidden} templateBack={currentStudyCardData.templateBack}
                                     templateFront={currentStudyCardData.templateFront}
                                     fieldContentPairs={currentStudyCardData.fieldContentPairs}
                        />
                        <Divider/>
                        <KartAIBox mb={1} flexCenter fullWidth hide={customStudy}>
                            <Typography
                                sx={studyCardsPageCardsCount("new", !initDone)}>{cardsInfo.newCards}</Typography>
                            <Typography sx={{fontSize: 23}}>+</Typography>
                            <Typography
                                sx={studyCardsPageCardsCount("learning", !initDone)}>{cardsInfo.learningCards}</Typography>
                            <Typography sx={{fontSize: 23}}>+</Typography>
                            <Typography
                                sx={studyCardsPageCardsCount("review", !initDone)}>{cardsInfo.reviewCards}</Typography>
                        </KartAIBox>

                        <KartAIBox mb={1} flexCenter fullWidth hide={!customStudy}>
                            <Typography
                                sx={studyCardsPageCardsCount("review", !initDone)}>{studyCards.length}</Typography>
                        </KartAIBox>

                        <KartAIBox fullWidth hide={!backHidden}>
                            <KartAIButton color="secondary" onClick={controller.flipToBack} fullWidth
                                          variant="contained">
                                {StaticText.SHOW_ANSWER}
                            </KartAIButton>
                        </KartAIBox>

                        <KartAIBox spacing={1} fullWidth gridCenter={isXsWindow()} flexCenter={!isXsWindow()}
                                   hide={backHidden || customStudy}>
                            <KartAIBox spacing={isXsWindow() ? 2 : 1} flexCenter fullWidth>
                                <KartAIButton color="secondary" fullWidth onClick={() => controller.flipToFront(0)}
                                              variant="contained">
                                    {StaticText.AGAIN}
                                </KartAIButton>
                                <KartAIButton color="secondary" fullWidth onClick={() => controller.flipToFront(1)}
                                              variant="contained">
                                    {StaticText.HARD} ({durationString.hard})
                                </KartAIButton>
                            </KartAIBox>
                            <KartAIBox spacing={isXsWindow() ? 2 : 1} flexCenter fullWidth>
                                <KartAIButton color="secondary" fullWidth onClick={() => controller.flipToFront(2)}
                                              variant="contained">
                                    {StaticText.GOOD} ({durationString.good})
                                </KartAIButton>
                                <KartAIButton color="secondary" fullWidth onClick={() => controller.flipToFront(3)}
                                              variant="contained">
                                    {StaticText.EASY} ({durationString.easy})
                                </KartAIButton>
                            </KartAIBox>
                        </KartAIBox>

                        <KartAIBox fullWidth spacing={1} flexCenter hide={backHidden || !customStudy}>
                            <KartAIButton color="secondary" fullWidth onClick={() => controller.flipToFront(0)}
                                          variant="contained">
                                {StaticText.UNKNOWN}
                            </KartAIButton>
                            <KartAIButton color="secondary" fullWidth onClick={() => controller.flipToFront(3)}
                                          variant="contained">
                                {StaticText.KNOWN}
                            </KartAIButton>
                        </KartAIBox>

                    </KartAIBox>
                </KartAIBox>
            </KartAIContainer>
        </PageTransitionWrapper>
    </KartAIBox>
}