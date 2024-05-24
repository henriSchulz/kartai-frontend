import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import {Feed, Inventory2, Login, Menu as MenuIcon} from "@mui/icons-material"
import Menu from '@mui/material/Menu';
import {Theme} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {theme} from "../styles/theme";
import {SxProps} from "@mui/system";
import OutlinedIconButton from "../components/OutlinedIconButton";
import KartAIBox from "../components/ui/KartAIBox";
import {StaticText} from "../data/text/staticText";
import {Icons} from "../assets/asserts";
import KartAIButton from "../components/ui/KartAIButton";
import {useGlobalContext} from "../App";
import {Settings as SettingsIcon} from "@mui/icons-material"
import AppController from "../AppController";
import AuthenticationService from "../services/AuthenticationService";
import {Settings} from "../Settings";


interface NavbarProps {

    sx?: SxProps<Theme>

    onClickSignIn(): void

    onOpenCardTypes(): void

    onOpenSettings(): void

    appController: AppController
}

export default function (props: NavbarProps) {

    const location = useLocation()

    const {topLevelInitDone} = useGlobalContext()

    const navigate = useNavigate()

    const showKartAIWeb = (location.pathname === "/" ||
        (location.pathname.startsWith("/public-deck/") && !AuthenticationService.current)) && !Settings.IS_ELECTRON

    const showLogin = location.pathname === "/" && !AuthenticationService.current

    const showSettings = location.pathname !== "/"

    const showNews = location.pathname === "/"


    return (
        <KartAIBox sx={{flexGrow: 1, width: "100%"}}>
            <AppBar sx={{...props.sx, zIndex: theme.zIndex.drawer + 1}} position="fixed">
                <Toolbar>
                    <KartAIBox onClick={props.appController.navigateToLaunchPage}
                               sx={{display: "flex", alignItems: "center", gap: 1, cursor: "pointer"}}>
                        <img height={30} width={30} src={Icons.KARTAI}/>

                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                color: theme.palette.primary.main,
                                ml: 1,
                                display: 'flex',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                textDecoration: 'none',
                                cursor: "pointer"
                            }}
                        >
                            KartAI
                        </Typography>

                    </KartAIBox>

                    {showNews && <KartAIBox ml={3}>
                        <KartAIButton startIcon={<Feed/>} sx={{fontSize: 18, fontWeight: 600}} size="large"
                                      onClick={() => window.open(Settings.NEWS_PAGE_LINK)}
                                      variant="text">
                            {StaticText.NEWS}
                        </KartAIButton>
                    </KartAIBox>}

                    <KartAIBox sx={{flexGrow: 1}}/>
                    <KartAIBox sx={{display: "flex"}}>
                        {
                            props.appController.showCardTypesOption(location.pathname) &&
                            <OutlinedIconButton disabled={!topLevelInitDone} onClick={props.onOpenCardTypes}>
                                <Inventory2 fontSize={"medium"}/>
                            </OutlinedIconButton>
                        }

                        {showLogin &&
                            <KartAIButton onClick={props.onClickSignIn} startIcon={<Login/>}
                                          sx={{fontSize: 18, fontWeight: 600, mr: 2}} size="large"
                                          variant="text">
                                {StaticText.SIGN_IN}
                            </KartAIButton>}

                        {showKartAIWeb &&
                            <KartAIButton disabled={!topLevelInitDone} onClick={() => navigate("/public-decks")}
                                          variant="outlined">
                                {StaticText.KARTAI_WEB}
                            </KartAIButton>}


                        {showSettings && <OutlinedIconButton onClick={props.onOpenSettings} disabled={!topLevelInitDone}
                                                             sx={{mr: 2, ml: 2}}>
                            <SettingsIcon fontSize="medium"/>
                        </OutlinedIconButton>}


                    </KartAIBox>
                </Toolbar>
            </AppBar>

            <Toolbar/>

        </KartAIBox>
    );
}
