import SharedItemsController from "../SharedItemsController";
import KartAIBox from "../../../components/ui/KartAIBox";
import {row} from "../../../styles/listView";
import SharedItem from "../../../types/dbmodel/SharedItem";
import {Button, Tooltip, Typography} from "@mui/material";
import {deckOverviewItemTitle} from "../../deck-overview/styles/deckOverviewPageItem";
import {useNavigate} from "react-router-dom";
import {Cloud, CloudOff} from "@mui/icons-material";
import AuthenticationService from "../../../services/AuthenticationService";
import {StaticText} from "../../../data/text/staticText";
import OutlinedIconButton from "../../../components/OutlinedIconButton";
import {sharedItemTitle} from "../styles/sharedItemStyles";
import KartAIButton from "../../../components/ui/KartAIButton";
import {reviewCardsCountColor} from "../../../styles/root";

interface SharedItemsViewItemProps {
    controller: SharedItemsController
    sharedItem: SharedItem

    onUnshare(): void
}


export default function ({controller, sharedItem, onUnshare}: SharedItemsViewItemProps) {

    const navigate = useNavigate()

    const goToSharedItem = () => navigate("/public-deck/" + sharedItem.id)

    return <KartAIBox flexSpaceBetween sx={row(false)}>

        <KartAIButton variant="text" onClick={goToSharedItem} startIcon={<Cloud/>}>
            <Typography variant="h5" sx={sharedItemTitle}>
                {sharedItem.sharedItemName}
            </Typography>
        </KartAIButton>

        <KartAIBox flexCenter spacing={2}>
            <KartAIBox flexCenter spacing={1}>
                <Typography> {StaticText.DOWNLOADS}:</Typography>
                <Typography sx={{color: reviewCardsCountColor}}>{sharedItem.downloads}</Typography>
            </KartAIBox>

            {sharedItem.clientId === AuthenticationService.current?.id && <Tooltip title={StaticText.UNSHARE}>
                <OutlinedIconButton onClick={onUnshare}>
                    <CloudOff/>
                </OutlinedIconButton>
            </Tooltip>}

        </KartAIBox>


    </KartAIBox>
}