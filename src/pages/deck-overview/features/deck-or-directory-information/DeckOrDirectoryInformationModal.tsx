import KartAIBox from "../../../../components/ui/KartAIBox";
import DeckOrDirectoryInformationController from "./DeckOrDirectoryInformationController";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {Badge, Folder, Functions} from "@mui/icons-material";
import CardUtils from "../../../../utils/CardUtils";
import DirectoryUtils from "../../../../utils/DirectoryUtils";
import DeckUtils from "../../../../utils/DeckUtils";

interface DeckOrDirectoryInformationModalProps {
    controller: DeckOrDirectoryInformationController
}

export default function ({controller}: DeckOrDirectoryInformationModalProps) {

    return <KartAIBox>

        <KartAIModal
            title={StaticText.INFORMATION}
            hideCancelButton submitButtonText={StaticText.GO_BACK}
            onSubmit={controller.submit}
            show={controller.states.showState.val}
            onClose={controller.close}>
            <List>
                <ListItem disablePadding>
                    <ListItemIcon>
                        <Badge fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.NAME}
                                  secondary={controller.deckOverviewController.states.tempDeckOrDirectoryState.val?.name}/>

                </ListItem>
                <ListItem disablePadding>
                    <ListItemIcon>
                        <Folder fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.LOCATION}
                                  secondary={DirectoryUtils.getInstance().getPathString(
                                      controller.deckOverviewController.states.tempDeckOrDirectoryState.val?.parentId, true)
                                  }/>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemIcon>
                        <Functions fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.CARDS}
                                  secondary={controller.getCardsCountText()}/>
                </ListItem>
            </List>
        </KartAIModal>


    </KartAIBox>

}