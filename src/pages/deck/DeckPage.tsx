import KartAIBox from "../../components/ui/KartAIBox";
import PageTransitionWrapper from "../../components/animation/PageTransitionWrapper";
import ListView from "../../components/list-view/ListView";
import ListViewHead from "../../components/list-view/ListViewHead";
import {useMemo, useState} from "react";
import {useGlobalContext} from "../../App";
import DeckUtils from "../../utils/DeckUtils";
import {useNavigate, useParams} from "react-router-dom";
import DirectoryUtils from "../../utils/DirectoryUtils";
import {Notes, School} from "@mui/icons-material";
import KartAIContainer from "../../components/ui/KartAIContainer";
import React from "react";
import Deck from "../../types/dbmodel/Deck";
import {Divider, Typography} from "@mui/material";
import {mediumBoldText} from "../../styles/typography";
import {StaticText} from "../../data/text/staticText";
import CardUtils from "../../utils/CardUtils";
import {deckFinishedText, deckPageCardsCount, deckPageStudyButton} from "./styles/deckPapeStyles";
import KartAIButton from "../../components/ui/KartAIButton";
import {isXsWindow} from "../../utils/general";


export default function () {
    const navigate = useNavigate()
    const {topLevelInitDone} = useGlobalContext()
    const {id: deckId} = useParams<{ id: string }>();


    const [loading, setLoading] = useState(true);
    const [initDone, setInitDone] = useState(false);
    const [deck, setDeck] = useState<Deck | null>(null)

    React.useEffect(() => {
        if (!topLevelInitDone) return

        if (!DeckUtils.getInstance().has(deckId)) {
            return navigate(`/deck-overview`)
        }

        setDeck(DeckUtils.getInstance().getById(deckId!))
        setInitDone(true)
    }, [deckId, topLevelInitDone])

    const currentDirectoryPath = useMemo(() => {
        if (!initDone || !deck) return []
        return DirectoryUtils.getInstance().getParentDirectoriesPath(deck?.parentId, true)
    }, [initDone, deck])

    const cardsInfo = useMemo(() => {
        const cardsInfo = {
            newCards: 0,
            learningCards: 0,
            reviewCards: 0,
        }

        if (!initDone || !deckId) return cardsInfo

        const cardsInDeck = CardUtils.getInstance().getCardsByDeckId(deckId)

        for (const card of cardsInDeck) {
            if (card.paused) continue
            if (card.dueAt > Date.now()) continue
            switch (CardUtils.getCardLevel(card)) {
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
    }, [deckId, initDone])

    const cardsAvailable = (cardsInfo.reviewCards + cardsInfo.learningCards + cardsInfo.newCards) > 0

    const manageCardsActionButton = {
        text: StaticText.MANAGE_CARDS,
        icon: <Notes/>,
        onClick: () => navigate(`/cards/${deckId}`)
    }

    const nextDueCard = useMemo(() => {
        return CardUtils.getInstance().getNextDueCard(deckId!)
    }, [deckId])


    return <KartAIBox>
        <PageTransitionWrapper>
            <KartAIContainer>
                <ListView>
                    <ListViewHead loading={!initDone}
                                  title={deck?.name}
                                  icon={<Notes/>}
                                  breadcrumbs={currentDirectoryPath}
                                  rightActionButton={!isXsWindow() ? manageCardsActionButton : undefined}
                    />
                    <Divider/>
                    <KartAIBox gridCenter>
                        <KartAIBox hide={!cardsAvailable} mt={10} flexCenter>
                            <KartAIBox gridStart sx={{gridTemplateColumns: "auto auto"}}>
                                <Typography sx={mediumBoldText}>{StaticText.NEW}</Typography>
                                <Typography sx={deckPageCardsCount("new", !loading)}>{cardsInfo.newCards}</Typography>
                                <Typography sx={mediumBoldText}>{StaticText.LEARN}</Typography>
                                <Typography
                                    sx={deckPageCardsCount("learning", !loading)}>{cardsInfo.learningCards}</Typography>
                                <Typography sx={mediumBoldText}>{StaticText.REVIEW}</Typography>
                                <Typography
                                    sx={deckPageCardsCount("review", !loading)}>{cardsInfo.reviewCards}</Typography>
                            </KartAIBox>

                            <KartAIButton
                                startIcon={<School fontSize="large"/>}
                                size="large"
                                variant="outlined"
                                sx={deckPageStudyButton}
                                disabled={!initDone}
                                onClick={() => navigate(`/study/${deckId}`)}
                            >{!isXsWindow() ? StaticText.LEARN_DECK : StaticText.LEARN}</KartAIButton>
                        </KartAIBox>

                        <KartAIBox gridCenter sx={{textAlign: "center"}} hide={cardsAvailable || !initDone} mt={10}>
                            <Typography sx={deckFinishedText}>{StaticText.DECK_FINISHED}</Typography>
                            {/*<KartAIBox hideIfXs hide={!nextDueCard}>*/}
                            {/*    <Typography>{StaticText.NEXT_LEARNING_CARD.replaceAll("{duration}", formatDuration(nextDueCard?.dueAt ?? 0))}</Typography>*/}
                            {/*</KartAIBox>*/}
                            <Typography>{StaticText.CUSTOM_STUDY_TEXT}</Typography>
                            <KartAIButton mt={5}
                                          startIcon={<School fontSize="large"/>}
                                          size="large"
                                          variant="outlined"
                                          sx={deckPageStudyButton}
                                          disabled={!initDone}
                                          onClick={() => navigate(`/custom-study/${deckId}`)}
                            >{StaticText.CUSTOM_STUDY}</KartAIButton>
                        </KartAIBox>

                    </KartAIBox>
                </ListView>
            </KartAIContainer>
        </PageTransitionWrapper>
    </KartAIBox>
}