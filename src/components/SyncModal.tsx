import KartAIModal from "./KartAIModal";
import {StaticText} from "../data/text/staticText";
import {LinearProgress, Typography} from "@mui/material";
import {NUM_SYNC_STEPS} from "../App";

interface SyncModalProps {
    show: boolean

    syncProgress: number


}

export default function ({show, syncProgress}: SyncModalProps) {
    return <KartAIModal notCancelable title={StaticText.SYNC} show={show} onClose={() => ""} hideButtons>
        <LinearProgress variant={syncProgress ? "determinate" : "indeterminate"}
                        value={Math.round((syncProgress / NUM_SYNC_STEPS) * 100)}
                        sx={{width: "100%"}}/>


        <Typography sx={{mt: 2}}>
            {syncProgress < 2 && StaticText.LOADING_DECKS}
            {syncProgress >= 2 && syncProgress < 4 && StaticText.LOADING_CARDS}
            {syncProgress >= 4 && syncProgress < 7 && syncProgress && StaticText.LOADING_CARD_TYPES}
            {syncProgress > 7 && StaticText.INITIALIZING}
        </Typography>
    </KartAIModal>
}