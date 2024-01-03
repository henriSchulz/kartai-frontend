import KartAIModal from "./KartAIModal";
import {StaticText} from "../data/text/staticText";
import {LinearProgress, Typography} from "@mui/material";
import AppController from "../AppController";


interface SyncModalProps {
    show: boolean

    syncProgress: number


}

export default function ({show, syncProgress}: SyncModalProps) {
    return <KartAIModal notCancelable title={StaticText.SYNC} show={show} onClose={() => ""} hideButtons>
        <LinearProgress variant="indeterminate"
                        sx={{width: "100%"}}/>


        <Typography sx={{mt: 2}}>
            {syncProgress === 0 && StaticText.AUTHENTICATING}
            {syncProgress !== 0 && StaticText.SYNC + "..."}
        </Typography>
    </KartAIModal>
}