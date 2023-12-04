import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import {Inventory2, Menu as MenuIcon} from "@mui/icons-material"
import Menu from '@mui/material/Menu';
import {Theme, Tooltip} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {theme} from "../styles/theme";
import {SxProps} from "@mui/system";
import OutlinedIconButton from "../components/OutlinedIconButton";
import KartAIBox from "../components/ui/KartAIBox";
import {StaticText} from "../data/text/staticText";
import {Icons} from "../asserts/asserts";
import {showCardTypesOption} from "../utils/general";
import KartAIButton from "../components/ui/KartAIButton";
import {useGlobalContext} from "../App";
import {Settings as SettingsIcon} from "@mui/icons-material"


interface NavbarProps {

    sx?: SxProps<Theme>

    onClickGettingStarted(): void

    onOpenSettings(): void

    onOpenCardTypes(): void

    onOpenSettings(): void
}

export default function (props: NavbarProps) {

    const location = useLocation()

    const {topLevelInitDone} = useGlobalContext()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const navigate = useNavigate()


    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };


    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menu = [
        {
            icon: <Inventory2 fontSize="medium"/>, text: StaticText.CARD_TYPES, onClick() {
                props.onOpenCardTypes()
            }
        },
        {
            icon: <SettingsIcon fontSize="medium"/>, text: StaticText.SETTINGS, onClick() {
                props.onOpenSettings()
            }
        }
    ].slice(!showCardTypesOption(location.pathname) ? 1 : 0)


    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            keepMounted
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {menu.map((item, index) => {
                return <MenuItem onClick={() => {
                    item.onClick()
                    handleMobileMenuClose()
                }} key={index}>
                    <OutlinedIconButton
                        sx={{width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start"}}>
                        {item.icon}
                        <Typography sx={{ml: 2}}> {item.text}</Typography>
                    </OutlinedIconButton>

                </MenuItem>
            })}
        </Menu>
    );

    return (
        <KartAIBox sx={{flexGrow: 1, width: "100%"}}>
            <AppBar sx={{...props.sx, zIndex: theme.zIndex.drawer + 1}} position="fixed">
                <Toolbar>
                    <KartAIBox onClick={() => navigate("/")}
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
                    <KartAIBox sx={{flexGrow: 1}}/>
                    <KartAIBox sx={{display: {xs: 'none', md: 'flex'}}}>
                        {showCardTypesOption(location.pathname) && <OutlinedIconButton>
                            <Inventory2 fontSize={"medium"}/>
                        </OutlinedIconButton>}

                        {location.pathname === "/" &&
                            <KartAIButton disabled={!topLevelInitDone} onClick={props.onClickGettingStarted}
                                          variant="outlined"
                                          sx={{mr: 2}}>
                                {StaticText.FLASHCARDS}
                            </KartAIButton>}


                        <OutlinedIconButton onClick={props.onClickGettingStarted} disabled={!topLevelInitDone}
                                            sx={{mr: 2}}>
                            <SettingsIcon fontSize="medium"/>
                        </OutlinedIconButton>


                    </KartAIBox>
                    {menu.length > 0 && <KartAIBox sx={{display: {xs: 'flex', md: 'none'}}}>
                        <OutlinedIconButton onClick={handleMobileMenuOpen}>
                            <MenuIcon/>
                        </OutlinedIconButton>
                    </KartAIBox>}
                </Toolbar>
            </AppBar>
            {menu.length > 0 && renderMobileMenu}

            <Toolbar/>

        </KartAIBox>
    );
}
