import React from "react";
import {
    Avatar,
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";


import {
    AccountCircle,
    Delete,
    Language,
    Logout,
    Storage,
    Settings as SettingsIcon,
    Edit,
    AutoAwesome
} from "@mui/icons-material";


import SettingsController from "./SettingsController";
import KartAIBox from "../../components/ui/KartAIBox";
import KartAIModal from "../../components/KartAIModal";
import AuthenticationService from "../../services/AuthenticationService";
import OutlinedIconButton from "../../components/OutlinedIconButton";
import {LANGUAGE_NAMES, StaticText} from "../../data/text/staticText";
import {Settings} from "../../Settings";
import CardUtils from "../../utils/CardUtils";
import LanguageSettingsController from "./features/language-settings/LanguageSettingsController";
import LanguageSettingsModal from "./features/language-settings/LanguageSettingsModal";
import OpenaiSettingsController from "./features/openai-settings/OpenaiSettingsController";
import OpenaiSettingsModal from "./features/openai-settings/OpenaiSettingsModal";
import DeleteClientModal from "./features/delete-client/DeleteClientModal";
import DeleteClientController from "./features/delete-client/DeleteClientController";


interface SettingsModalProps {
    controller: SettingsController
}

export default function ({controller}: SettingsModalProps) {

    const [showLanguageSettingsModal, setShowLanguageSettingsModal] = React.useState(false)
    const [showOpenaiSettingsModal, setShowOpenaiSettingsModal] = React.useState(false)
    const [showDeleteClientModal, setShowDeleteClientModal] = React.useState(false)
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(Settings.LANGUAGE)
    const [selectedGptVersion, setSelectedGptVersion] = React.useState<string>(Settings.GPT_VERSION)
    const [loading, setLoading] = React.useState(false)

    const languageSettingsController = new LanguageSettingsController({
        snackbar: controller.snackbar,
        states: {
            showState: {
                val: showLanguageSettingsModal,
                set: setShowLanguageSettingsModal
            },
            selectedLanguageState: {
                val: selectedLanguage,
                set: setSelectedLanguage
            }
        }
    })

    const openaiSettingsController = new OpenaiSettingsController({
        snackbar: controller.snackbar,
        states: {
            showState: {
                val: showOpenaiSettingsModal,
                set: setShowOpenaiSettingsModal
            },
            selectedGptVersionState: {
                val: selectedGptVersion,
                set: setSelectedGptVersion
            },
            loadingState: {
                val: loading,
                set: setLoading
            }
        }
    })

    const deleteClientController = new DeleteClientController({
        snackbar: controller.snackbar,
        states: {
            showState: {
                val: showDeleteClientModal,
                set: setShowDeleteClientModal
            },
            loadingState: {
                val: loading,
                set: setLoading
            }
        }
    })


    return <KartAIBox>

        {showLanguageSettingsModal && <LanguageSettingsModal controller={languageSettingsController}/>}
        {showOpenaiSettingsModal && <OpenaiSettingsModal controller={openaiSettingsController}/>}
        {showDeleteClientModal && <DeleteClientModal controller={deleteClientController}/>}


        <KartAIModal show={controller.states.showState.val}
                     title={StaticText.SETTINGS}
                     submitButtonText={StaticText.GO_BACK}
                     hideCancelButton
                     onClose={controller.close}
                     onSubmit={controller.submit}>

            <List>
                {AuthenticationService.current && <ListItem secondaryAction={
                    <OutlinedIconButton onClick={deleteClientController.open}>
                        <Delete/>
                    </OutlinedIconButton>
                } disablePadding>
                    <ListItemIcon>
                        {AuthenticationService.current!.imgUrl ? <Avatar
                                src={AuthenticationService.current!.imgUrl}
                            /> :
                            <AccountCircle fontSize="large"/>}

                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.USER}
                                  secondary={<>
                                      {AuthenticationService.current!.userName ?? AuthenticationService.current!.email}
                                  </>}/>
                </ListItem>}
                <ListItem secondaryAction={
                    <OutlinedIconButton onClick={languageSettingsController.open}>
                        <Edit/>
                    </OutlinedIconButton>
                } disablePadding>
                    <ListItemIcon>
                        <Language fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.LANGUAGE}
                                  secondary={LANGUAGE_NAMES[Settings.LANGUAGE]}/>
                </ListItem>

                {AuthenticationService.current && <ListItem secondaryAction={
                    <OutlinedIconButton onClick={openaiSettingsController.open}>
                        <SettingsIcon/>
                    </OutlinedIconButton>
                } disablePadding>
                    <ListItemIcon>
                        <AutoAwesome fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                  secondaryTypographyProps={{fontSize: '17px'}}
                                  primary={StaticText.GPT}
                                  secondary={Settings.OPENAI_KEY === "" ?
                                      StaticText.PLEASE_SET_OPENAI_KEY : Settings.GPT_VERSION}/>
                </ListItem>}


                {AuthenticationService.current &&

                    <ListItem disablePadding>
                        <ListItemIcon>
                            <Storage fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{fontSize: '20px', fontWeight: 550}}
                                      secondaryTypographyProps={{fontSize: '17px'}}
                                      primary={StaticText.STORAGE_USAGE}
                                      secondary={`${Math.round((CardUtils.getInstance().toArray().length / (CardUtils.getInstance().maxClientSize)) * 100)}% ${StaticText.X_OUT_OF_Y_CARDS
                                          .replaceAll("{x}", CardUtils.getInstance().toArray().length.toString())
                                          .replaceAll("{y}", CardUtils.getInstance().maxClientSize.toString())}`}

                        />
                    </ListItem>}

            </List>

            {AuthenticationService.current && <KartAIBox fullWidth>
                <Divider/>
                <Button startIcon={<Logout/>} fullWidth variant="contained"
                        onClick={() => AuthenticationService.signOut()}>{StaticText.SIGN_OUT}</Button>
            </KartAIBox>}

        </KartAIModal>
    </KartAIBox>
}