import CardInformationController from "./CardInformationController";
import KartAIBox from "../../../../components/ui/KartAIBox";
import KartAIModal from "../../../../components/KartAIModal";
import {StaticText} from "../../../../data/text/staticText";
import {Divider, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {Badge, ChevronRight, Functions, Psychology, Schedule} from "@mui/icons-material";
import {useMemo} from "react";
import DeckUtils from "../../../../utils/DeckUtils";
import CardTypeUtils from "../../../../utils/CardTypeUtils";
import FieldContentUtils from "../../../../utils/FieldContentUtils";
import DirectoryUtils from "../../../../utils/DirectoryUtils";
import {useGlobalContext} from "../../../../App";
import {formatDuration} from "../../../../utils/general";

interface CardInformationModalProps {
    controller: CardInformationController
}


export default function ({controller}: CardInformationModalProps) {

    const {cardTypesController} = useGlobalContext()

    const data = useMemo(() => {
        const card = controller.cardsController.states.tempSelectedCardState.val
        if (!card) return null
        return {
            deck: DeckUtils.getInstance().getById(card.deckId),
            cardType: CardTypeUtils.getInstance().getById(card.cardTypeId),
            fieldContentPairs: FieldContentUtils.getInstance().getFieldContentPairs(card.id),
            pathString: controller.getPathString(),
            dueIn: controller.getDueIn()
        }

    }, [controller.states.showState.val, cardTypesController.states.showState.val])


    return <KartAIBox>


        <KartAIModal
            show={controller.states.showState.val}
            onClose={controller.close}
            title={StaticText.INFORMATION}
            hideCancelButton
            submitButtonText={StaticText.GO_BACK}
            onSubmit={controller.close}
        >
            <List>

                <ListItem disablePadding>
                    <ListItemIcon>
                        <Badge fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.DECK}
                                  secondary={`${data?.pathString}${data?.pathString !== "/" ? "/" : ""}${data?.deck.name}`}/>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemIcon>
                        <Badge fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.CARD_TYPE}
                                  secondary={data?.cardType.name}/>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemIcon>
                        <Schedule fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.DUE_IN}
                                  secondary={(data && data?.dueIn > 0) ? formatDuration(data?.dueIn) : StaticText.DUE_NOW}/>
                </ListItem>


                <ListItem sx={{mb: 1}} disablePadding>
                    <ListItemIcon>
                        <Psychology fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.LEARNING_LEVEL}
                                  secondary={controller.cardsController.states.tempSelectedCardState.val?.learningState}/>
                </ListItem>
                <Divider/>
                {(data?.fieldContentPairs ?? []).map((fieldContentPair, index) => {
                    return <ListItem sx={{mt: 1}} key={index} disablePadding>
                        <ListItemIcon>
                            <ChevronRight fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                      secondaryTypographyProps={{fontSize: '17px'}}
                                      primary={fieldContentPair.field.name}
                                      secondary={fieldContentPair.fieldContent.content}/>
                    </ListItem>
                })
                }


            </List>
        </KartAIModal>


    </KartAIBox>
}