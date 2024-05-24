import KartAIBox from "../../../../components/ui/KartAIBox";
import DeckOrDirectoryInformationController from "./DeckOrDirectoryInformationController";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography} from "@mui/material";
import {Badge, Calculate, Folder, Functions, Info} from "@mui/icons-material";
import CardUtils from "../../../../utils/CardUtils";
import DirectoryUtils from "../../../../utils/DirectoryUtils";
import DeckUtils from "../../../../utils/DeckUtils";
import {useMemo} from "react";

interface DeckOrDirectoryInformationModalProps {
    controller: DeckOrDirectoryInformationController
}

export default function ({controller}: DeckOrDirectoryInformationModalProps) {

    const averageLearningState = controller.getAverageLearningState()
    const cardsCount = controller.getCardsCount()

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
                                  secondary={cardsCount}/>
                </ListItem>

                {cardsCount > 0 && <ListItem disablePadding>
                    <ListItemIcon>
                        <Calculate fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={<KartAIBox spacing={1} sx={{display: "flex", alignItems: "center"}}>
                                      {StaticText.AVERAGE_LEARNING_LEVEL}
                                      <Tooltip title={<Typography sx={{fontSize: 14}}>{StaticText.LEARNING_STATE_INFO}</Typography>}>
                                          <Info fontSize="small"/>
                                      </Tooltip>
                                  </KartAIBox>}
                                  secondary={averageLearningState}/>
                </ListItem>}

            </List>
        </KartAIModal>


    </KartAIBox>

}