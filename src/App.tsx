import React from 'react';
import {
    Alert,
    AlertColor,
    Backdrop,
    CircularProgress,
    Snackbar,
    ThemeProvider
} from "@mui/material";
import {theme} from "./styles/theme";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {SnackbarProps} from "./types/snackbar";
import {getWindowWidth} from "./utils/general";
import CardType from "./types/dbmodel/CardType";

import SyncModal from "./components/SyncModal";
import KartAIBox from "./components/ui/KartAIBox";
import Navbar from "./layout/Navbar";
import {AnimatePresence} from "framer-motion";
import Sidebar from "./layout/Sidebar";
import LaunchPage from "./pages/launch-page/LaunchPage";
import DeckOverviewPage from "./pages/deck-overview/DeckOverviewPage";
import Context from "./types/Context";
import ErrorModalProps from "./types/ErrorModalProps";
import {StaticText} from "./data/text/staticText";
import KartAIModal from "./components/KartAIModal";

import DeckPage from "./pages/deck/DeckPage";
import CardsPage from "./pages/cards/CardsPage";
import StudyCardsPage from "./pages/study-cards/StudyCardsPage";
import CardTypesController from "./features/card-types/CardTypesController";
import CardTypesModal from "./features/card-types/CardTypesModal";
import AppController from "./AppController";
import SettingsModal from "./features/settings/SettingsModal";
import SettingsController from "./features/settings/SettingsController";
import AuthenticationController from "./features/authentication/AuthenticationController";
import AuthenticationModal from "./features/authentication/AuthenticationModal";
import SharedItemsPage from "./pages/shared-items/SharedItemsPage";
import SharedItemPage from "./pages/shared-item/SharedItemPage";
import KartAIButton from "./components/ui/KartAIButton";


const GlobalContext = React.createContext<Context.GlobalContext>({} as Context.GlobalContext)

export const useGlobalContext = () => React.useContext(GlobalContext)


function App() {
    const navigate = useNavigate()
    const location = useLocation()

    const [topLevelInitDone, setTopLevelInitDone] = React.useState<boolean>(false)

    const [errorModalProps, setErrorModalProps] = React.useState<ErrorModalProps | null>(null)

    const [snackbarProps, setSnackbarProps] = React.useState<SnackbarProps | null>(null)

    const [showLoadingBackdrop, setShowLoadingBackdrop] = React.useState<boolean>(false)

    const [syncProgress, setSyncProgress] = React.useState<number>(0)

    const [showCardTypesModal, setShowCardTypesModal] = React.useState<boolean>(false)

    const [tempSelectedCardType, setTempSelectedCardType] = React.useState<CardType | null>(null)

    const [showSettingsModal, setShowSettingsModal] = React.useState<boolean>(false)

    const [showAuthenticatingModal, setShowAuthenticatingModal] = React.useState<boolean>(false)

    const [showCookieConsentState, setShowCookieConsentState] = React.useState<boolean>(false)

    const [loading, setLoading] = React.useState<boolean>(false)
    const [isSigningUp, setIsSigningUp] = React.useState<boolean>(false)


    const appController = new AppController({
        navigate,
        path: location.pathname,
        states: {
            topLevelInitDoneState: {val: topLevelInitDone, set: setTopLevelInitDone},
            errorModalPropsState: {val: errorModalProps, set: setErrorModalProps},
            snackbarPropsState: {val: snackbarProps, set: setSnackbarProps},
            showLoadingBackdropState: {val: showLoadingBackdrop, set: setShowLoadingBackdrop},
            syncProgressState: {val: syncProgress, set: setSyncProgress},
            showCookieConsentState: {val: showCookieConsentState, set: setShowCookieConsentState}
        }
    })

    const cardTypesController = new CardTypesController({
        snackbar: appController.snackbar,
        states: {
            showState: {val: showCardTypesModal, set: setShowCardTypesModal},
            tempSelectedCardTypeState: {val: tempSelectedCardType, set: setTempSelectedCardType}
        }
    })

    const settingsController = new SettingsController({
        snackbar: appController.snackbar,
        states: {
            showState: {val: showSettingsModal, set: setShowSettingsModal}
        }
    })

    const authenticationController = new AuthenticationController({
        snackbar: appController.snackbar, navigate, loadingBackdrop: appController.loadingBackdrop,
        states: {
            showState: {val: showAuthenticatingModal, set: setShowAuthenticatingModal},
            loadingState: {val: loading, set: setLoading},
            isSigningUpState: {val: isSigningUp, set: setIsSigningUp}
        }
    })


    React.useEffect(() => {
        appController.init().then(r => setTopLevelInitDone(true))
    }, [])


    return (

        <ThemeProvider theme={theme}>
            <GlobalContext.Provider value={{
                topLevelInitDone,
                snackbar: appController.snackbar,
                loadingBackdrop: appController.loadingBackdrop,
                cardTypesController
            }}>

                {/* Modals & Snackbar*/}
                <KartAIBox>

                    <Snackbar
                        anchorOrigin={{horizontal: "center", vertical: "top"}}
                        open={showCookieConsentState}
                        onClose={() => setShowCookieConsentState(false)}
                        message={StaticText.COOKIE_DESCRIPTION}
                        action={
                            <KartAIButton variant="text"
                                          onClick={appController.onAllowCookies}>{StaticText.ACCEPT}
                            </KartAIButton>
                        }
                    />

                    {snackbarProps && snackbarProps.variant === "default" &&
                        <Snackbar anchorOrigin={{
                            horizontal: "left",
                            vertical: getWindowWidth() === "xs" ? "top" : "bottom"
                        }}
                                  open={Boolean(snackbarProps)} message={snackbarProps.message}
                                  autoHideDuration={snackbarProps.autoHideDuration}
                                  onClose={() => setSnackbarProps(null)}/>}

                    {snackbarProps && snackbarProps.variant !== "default" &&
                        <Snackbar anchorOrigin={{
                            horizontal: "left",
                            vertical: getWindowWidth() === "xs" ? "top" : "bottom"
                        }}
                                  open={Boolean(snackbarProps)}
                                  autoHideDuration={snackbarProps.autoHideDuration}
                                  onClose={() => setSnackbarProps(null)}>
                            <Alert onClose={() => setSnackbarProps(null)}
                                   severity={snackbarProps.variant as AlertColor}
                                   sx={{width: '100%'}}>
                                {snackbarProps.message}
                            </Alert>
                        </Snackbar>}

                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                        open={showLoadingBackdrop}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>


                    <SyncModal show={appController.showSyncModal(location.pathname)} syncProgress={syncProgress}/>

                    <KartAIModal notCancelable hideCancelButton submitButtonText={StaticText.RELOAD}
                                 title={errorModalProps?.title ?? ""}
                                 show={Boolean(errorModalProps)}
                                 onSubmit={() => window.location.reload()}
                                 onClose={() => setErrorModalProps(null)}>
                        <Alert severity="error">
                            {errorModalProps?.message}
                        </Alert>
                    </KartAIModal>

                    {showCardTypesModal && <CardTypesModal controller={cardTypesController}/>}
                    {showSettingsModal && <SettingsModal controller={settingsController}/>}
                    {showAuthenticatingModal && <AuthenticationModal controller={authenticationController}/>}


                </KartAIBox>


                <Navbar
                    onOpenSettings={settingsController.open}
                    onOpenCardTypes={cardTypesController.open}
                    appController={appController}
                />

                {appController.showSidebar(location.pathname) && <Sidebar/>}

                <AnimatePresence mode="wait"
                                 initial={false}

                >
                    <Routes location={location} key={location.pathname}>
                        <Route path="/"
                               element={<LaunchPage onClickGettingStarted={authenticationController.open}/>}/>
                        <Route path="/deck-overview" element={<DeckOverviewPage/>}/>
                        <Route path="/folder/:id" element={<DeckOverviewPage/>}/>
                        <Route path="/deck/:id" element={<DeckPage/>}/>
                        <Route path="cards/:id" element={<CardsPage/>}/>
                        <Route path="/study/:id" element={<StudyCardsPage/>}/>
                        <Route path="/custom-study/:id" element={<StudyCardsPage customStudy/>}/>
                        <Route path="/public-decks" element={<SharedItemsPage/>}/>
                        <Route path="public-deck/:id" element={<SharedItemPage/>}/>
                    </Routes>
                </AnimatePresence>


            </GlobalContext.Provider>

        </ThemeProvider>


    );
}

export default App;
