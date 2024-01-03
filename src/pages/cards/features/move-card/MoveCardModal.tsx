import MoveCardController from "./MoveCardController";
import KartAIModal from "../../../../components/KartAIModal";
import KartAIBox from "../../../../components/ui/KartAIBox";
import {useMemo} from "react";
import DeckUtils from "../../../../utils/DeckUtils";
import KartAISelect from "../../../../components/ui/KartAISelect";
import {StaticText} from "../../../../data/text/staticText";

interface MoveCardModalProps {
    controller: MoveCardController
}

export default function ({controller}: MoveCardModalProps) {

    const {title} = useMemo(controller.getTexts, [controller.states.showState.val])

    const destinationDeckOptions = useMemo(() => {
        return DeckUtils.getInstance().toArray().filter(deck => deck.id !== controller.cardsController.states.tempSelectedCardState.val?.deckId).map(deck => {
            return {
                value: deck.id,
                label: deck.name
            }

        })
    }, [controller.states.showState.val])

    return <KartAIBox>


        <KartAIModal title={title}
                     show={controller.states.showState.val}
                     onClose={controller.close}
                     onSubmit={controller.submit}
                     submitButtonText={StaticText.MOVE}
        >
            <KartAISelect fullWidth
                          onChange={controller.states.selectedDestinationDeckIdState.set}
                          value={controller.states.selectedDestinationDeckIdState.val}
                          options={destinationDeckOptions}
                          label={StaticText.MOVE_TO_DECK}
            />
        </KartAIModal>
    </KartAIBox>
}