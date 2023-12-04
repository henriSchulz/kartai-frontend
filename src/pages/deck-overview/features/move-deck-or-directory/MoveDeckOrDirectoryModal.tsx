import MoveDeckOrDirectoryController from "./MoveDeckOrDirectoryController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {useMemo} from "react";
import KartAISelect from "../../../../components/ui/KartAISelect";
import DirectoryUtils from "../../../../utils/DirectoryUtils";
import React from "react";

interface MoveDeckOrDirectoryModalProps {
    controller: MoveDeckOrDirectoryController
}

export default function ({controller}: MoveDeckOrDirectoryModalProps) {


    const {title} = useMemo(controller.getTexts, [controller.states.showState,
        controller.deckOverviewController.states.selectedEntitiesState])

    const [destinationDirOptions, setDestinationDirOptions] = React.useState<{ value: string, label: string }[]>([])

    React.useEffect(() => {
        if (!controller.states.showState.val) return

        const destinationDirs = controller.getPossibleDestinationDirectories()

        if (destinationDirs.length === 0) {
            controller.deckOverviewController.snackbar(StaticText.NO_FOLDER_TO_MOVE_IN, 4000, "error")
            return controller.states.showState.set(false)
        }

        controller.states.selectedDestinationDirectoryIdState.set(destinationDirs[0].id)

        const destinationDirOptions = destinationDirs.map(dir =>
            ({value: dir.id, label: DirectoryUtils.getInstance().getPathString(dir.id, true)})
        )

        setDestinationDirOptions(destinationDirOptions)
    }, [
        controller.states.showState.val,
        controller.deckOverviewController.states.tempDeckOrDirectoryState.val,
        controller.deckOverviewController.states.selectedEntitiesState.val
    ])


    return <KartAIBox>
        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            onSubmit={controller.submit}
            title={title}
        >
            <KartAISelect
                fullWidth
                label={StaticText.MOVE_TO_FOLDER}
                options={destinationDirOptions}
                value={controller.states.selectedDestinationDirectoryIdState.val}
                onChange={controller.states.selectedDestinationDirectoryIdState.set}
            />
        </KartAIModal>
    </KartAIBox>

}