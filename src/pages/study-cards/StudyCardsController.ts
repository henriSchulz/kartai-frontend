import {SnackbarFunction} from "../../types/snackbar";
import State from "../../types/State";

import DeckUtils from "../../utils/DeckUtils";
import CardUtils from "../../utils/CardUtils";
import DirectoryUtils from "../../utils/DirectoryUtils";
import {formatDuration, shuffleArray} from "../../utils/general";
import StudyCard from "../../types/StudyCard";
import {NavigateFunction} from "react-router-dom";
import Card from "../../types/dbmodel/Card";
import CardTypeVariantUtils from "../../utils/CardTypeVariantUtils";
import {loadingGray} from "../../styles/root";


interface StudyCardsControllerOptions {
    snackbar: SnackbarFunction
    topLevelInitDone: boolean
    customStudy?: boolean
    navigate: NavigateFunction
    id: string
    states: {
        studyCardsState: State<StudyCard[]>
        initDoneState: State<boolean>
        backHiddenState: State<boolean>
    }
}


export default class StudyCardsController {

    public snackbar: SnackbarFunction
    public states: StudyCardsControllerOptions["states"]
    public topLevelInitDone: boolean
    public customStudy: boolean
    public navigate: NavigateFunction
    public id: string

    constructor(options: StudyCardsControllerOptions) {
        this.snackbar = options.snackbar
        this.states = options.states
        this.topLevelInitDone = options.topLevelInitDone
        this.customStudy = Boolean(options.customStudy)
        this.navigate = options.navigate
        this.id = options.id
    }


    public init = (): boolean => {
        if (!this.id) return false
        if (DeckUtils.getInstance().has(this.id)) {
            const cards = CardUtils.getInstance().getAllBy("deckId", this.id)
            const studyCards = CardUtils.toStudyCards(this.customStudy ? cards : CardUtils.toLearningCards(cards))
            if (!studyCards.length) return false
            this.states.studyCardsState.set(shuffleArray(studyCards))
            return true
        } else if (DirectoryUtils.getInstance().has(this.id)) {
            const cards = CardUtils.getInstance().getCardsByDirectoryId(this.id)
            const studyCards = CardUtils.toStudyCards(this.customStudy ? cards : CardUtils.toLearningCards(cards))
            if (!studyCards.length) return false
            this.states.studyCardsState.set(shuffleArray(studyCards))
            return true
        } else {
            return false
        }
    }

    public getCurrentStudyCard = (): StudyCard | null => {
        const studyCard = this.states.studyCardsState.val[this.states.studyCardsState.val.length - 1]
        if (!studyCard) return null
        return studyCard
    }

    public getNextLearningStateDueDurations = (): { hard: string, good: string, easy: string } => {
        const currentCard = this.getCurrentStudyCard()
        if (!currentCard) return {
            hard: "0",
            good: "0",
            easy: "0",
        }

        const durationString = (rating: 0 | 1 | 2 | 3) => {
            const duration = CardUtils.getLearningStateDueDuration(
                CardUtils.calcNextLearningState(currentCard.card, rating)
            )
            if (duration === 0) return "< 10m"

            return formatDuration(duration)
        }


        return {
            hard: durationString(currentCard.card.learningState === 0 ? 0 : 1),
            good: durationString(2),
            easy: durationString(3),
        }


    }

    private shouldNavigateBack(rating: 0 | 1 | 2 | 3): boolean {
        const currentStudyCard = this.getCurrentStudyCard()
        const length = this.states.studyCardsState.val.length
        if (rating === 0) return false
        if (rating === 1 && currentStudyCard?.card.learningState === 0) return false
        return length === 1
    }

    public shuffleStudyCards = (updateCard: StudyCard | null) => {
        if (updateCard) {
            this.states.studyCardsState.set(prev => {
                const studyCardsCopy = prev.filter(studyCard => studyCard.card.id !== updateCard.card.id)
                return shuffleArray([...studyCardsCopy, updateCard])
            })

        } else this.states.studyCardsState.set(prev => shuffleArray([...prev]))
    }

    // card to update need to be the last element in the array (studyCardsState)
    public refreshStudyCard = (idToRefresh: string) => {
        this.states.studyCardsState.set(prev => {
            const studyCardsCopy = [...prev]
            const updateCard = CardUtils.getInstance().getById(idToRefresh)
            const studyCards = CardUtils.toStudyCards([updateCard])


            for (const studyCard of studyCards) {
                const index = this.states.studyCardsState.val.findIndex(sc =>
                    studyCard.card.id === sc.card.id && sc.variant.id === studyCard.variant.id
                )
                studyCardsCopy[index] = studyCard
            }

            return studyCardsCopy
        })
    }

    public removeCurrentStudyCard = (updateCard: StudyCard | null) => {
        if (updateCard) {
            this.states.studyCardsState.set(prev => {
                const studyCardsCopy = prev.filter(studyCard => studyCard.card.id !== updateCard.card.id)
                return [...studyCardsCopy]
            })
        } else this.states.studyCardsState.set(prev => shuffleArray([...prev.slice(0, -1)]))
    }

    public flipToFront = (rating: 0 | 1 | 2 | 3) => {
        if (this.states.backHiddenState.val) return
        const currentStudyCard = this.getCurrentStudyCard()

        if (!currentStudyCard) throw new Error("No current study card")

        const learningState = currentStudyCard.card.learningState


        const navigateBack = this.shouldNavigateBack(rating)


        if (!this.customStudy) {
            const newLearningState = CardUtils.calcNextLearningState(currentStudyCard.card, rating)
            let updateStudyCard = null
            // if (newLearningState !== currentStudyCard.card.learningState) {
            let dueDuration = Date.now() + CardUtils.getLearningStateDueDuration(newLearningState)

            if (rating === 0) dueDuration = Date.now()
            if (rating === 1 && learningState === 0) dueDuration = Date.now()

            const updateCard = {
                ...currentStudyCard.card,
                learningState: newLearningState,
                dueAt: dueDuration
            }

            CardUtils.getInstance().update(updateCard)

            updateStudyCard = {
                ...currentStudyCard,
                card: updateCard
            }
            // }

            if (rating === 0) {
                this.shuffleStudyCards(updateStudyCard)
            } else {
                if (learningState === 0) {
                    if (rating === 1) {
                        this.shuffleStudyCards(updateStudyCard)
                    } else this.removeCurrentStudyCard(updateStudyCard)
                } else this.removeCurrentStudyCard(updateStudyCard)
            }
        }

        if (this.customStudy) {
            if (rating === 0) {
                this.shuffleStudyCards(null)
            } else {
                this.removeCurrentStudyCard(null)
            }
        }


        if (navigateBack) this.navigateBack()

        this.states.backHiddenState.set(true)
    }

    public flipToBack = () => {
        this.updateTypedAnswerFieldValue()
        this.states.backHiddenState.set(false)
    }


    public updateTypedAnswerFieldValue = () => {
        const input = document.getElementById("typeAnswerField") as HTMLInputElement
        if (input) {
            window.tempInputValue = input.value
        }
    }


    public navigateBack = () => {

        if (DeckUtils.getInstance().has(this.id)) {
            this.navigate("/deck/" + this.id)
        } else {
            this.navigate("/folder/" + this.id)
        }
    }


    public isTypeFieldCardFocused = (): boolean => {
        return document.getElementById("typeAnswerField") === document.activeElement
    }


    public getOnKeyboardShortcut = (shortcuts: { [char: string]: () => void }, isModalOpen: boolean) => {
        return (event: KeyboardEvent) => {
            if (isModalOpen || this.isTypeFieldCardFocused()) return
            const char = event.key
            if (shortcuts[char]) {
                shortcuts[char]()
            }
        }
    }
}