import React, {useEffect} from 'react';
import {
    Alert,
    AlertColor,
    Backdrop,
    CircularProgress,
    LinearProgress,
    Modal,
    Snackbar,
    ThemeProvider
} from "@mui/material";
import {theme} from "./styles/theme";
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {SnackbarFunction, SnackbarProps} from "./types/snackbar";
import {getWindowWidth} from "./utils/general";
import ApiService from "./services/ApiService";
import {useAppDispatch} from "./hooks/reduxUtils";
import {
    decksSlice,
    sharedItemsSlice,
    fieldContentsSlice,
    fieldsSlice,
    directoriesSlice,
    cardTypeVariantsSlice,
    cardTypesSlice,
    cardsSlice
} from "./stores/slices";
import Deck from "./types/dbmodel/Deck";
import Directory from "./types/dbmodel/Directory";
import Card from "./types/dbmodel/Card";
import CardType from "./types/dbmodel/CardType";
import Field from "./types/dbmodel/Field";
import CardTypeVariant from "./types/dbmodel/CardTypeVariant";
import FieldContent from "./types/dbmodel/FieldContent";
import SyncModal from "./components/SyncModal";
import KartAIBox from "./components/ui/KartAIBox";
import Navbar from "./layout/Navbar";
import {AnimatePresence} from "framer-motion";
import Sidebar from "./layout/Sidebar";
import LaunchPage from "./pages/LaunchPage";
import DeckOverviewPage from "./pages/deck-overview/DeckOverviewPage";
import Context from "./types/Context";
import ErrorModalProps from "./types/ErrorModalProps";
import {StaticText} from "./data/text/staticText";
import KartAIModal from "./components/KartAIModal";
import LoadingBackdropFunction from "./types/LoadingBackdropFunction";
import defaultCardType from "./data/defaultCardType";
import CardTypeUtils from "./utils/CardTypeUtils";
import FieldUtils from "./utils/FieldUtils";
import CardTypeVariantUtils from "./utils/CardTypeVariantUtils";


const GlobalContext = React.createContext<Context.GlobalContext>({} as Context.GlobalContext)

export const useGlobalContext = () => React.useContext(GlobalContext)

export const NUM_SYNC_STEPS = 8

function App() {
    const navigate = useNavigate()
    const location = useLocation()

    const [topLevelInitDone, setTopLevelInitDone] = React.useState<boolean>(false)

    const [errorModalProps, setErrorModalProps] = React.useState<ErrorModalProps | null>(null)

    const [snackbarProps, setSnackbarProps] = React.useState<SnackbarProps | null>(null)

    const [showLoadingBackdrop, setShowLoadingBackdrop] = React.useState<boolean>(false)

    const [syncProgress, setSyncProgress] = React.useState<number>(0)

    const snackbar: SnackbarFunction = (message, autoHideDuration, variant) => {
        const snackbarProps: SnackbarProps = {
            message,
            autoHideDuration,
            variant: variant ?? "default"
        }
        setSnackbarProps(snackbarProps)
    }


    const loadingBackdrop: LoadingBackdropFunction = (show: boolean) => {
        setShowLoadingBackdrop(show)
    }


    const dispatch = useAppDispatch()


    async function init() {
        try {
            const decks = await new ApiService<Deck>("decks").loadAll()
            setSyncProgress(1)
            const directories = await new ApiService<Directory>("directories").loadAll()
            setSyncProgress(2)
            const cards = await new ApiService<Card>("cards").loadAll()
            setSyncProgress(3)
            const fieldContents = await new ApiService<FieldContent>("fieldContents").loadAll()
            setSyncProgress(4)
            const cardTypes = await new ApiService<CardType>("cardTypes").loadAll()
            setSyncProgress(5)
            const fields = await new ApiService<Field>("fields").loadAll()
            setSyncProgress(6)
            const cardTypeVariants = await new ApiService<CardTypeVariant>("cardTypeVariants").loadAll()
            setSyncProgress(7)

            dispatch(decksSlice.actions.init(decks))
            dispatch(directoriesSlice.actions.init(directories))
            dispatch(cardsSlice.actions.init(cards))
            dispatch(cardTypesSlice.actions.init(cardTypes))
            dispatch(fieldsSlice.actions.init(fields))
            dispatch(cardTypeVariantsSlice.actions.init(cardTypeVariants))
            dispatch(fieldContentsSlice.actions.init(fieldContents))

            // CardTypeUtils.getInstance().add(defaultCardType.defaultCardType)
            // FieldUtils.getInstance().add([defaultCardType.defaultFieldFront, defaultCardType.defaultFieldBack])
            // CardTypeVariantUtils.getInstance().add(defaultCardType.defaultCardTypeVariant)
            setSyncProgress(8)
        } catch (e) {
            setErrorModalProps({
                title: StaticText.NO_API_CONNECTION,
                message: StaticText.NO_API_CONNECTION_TEXT,
            })
        }
    }


    React.useEffect(() => {
        init().then(r => setTopLevelInitDone(true))
    }, [])


    return (

        <ThemeProvider theme={theme}>
            <GlobalContext.Provider value={{topLevelInitDone, snackbar, loadingBackdrop}}>

                {/* Modals & Snackbar*/}
                <KartAIBox>
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


                    <SyncModal show={!topLevelInitDone} syncProgress={syncProgress}/>

                    <KartAIModal hideCancelButton submitButtonText={StaticText.RELOAD}
                                 title={errorModalProps?.title ?? ""}
                                 show={Boolean(errorModalProps)}
                                 onSubmit={() => window.location.reload()}
                                 onClose={() => setErrorModalProps(null)}>
                        <Alert severity="error">
                            {errorModalProps?.message}
                        </Alert>
                    </KartAIModal>

                </KartAIBox>


                <Navbar
                    onClickGettingStarted={() => snackbar("Not implemented yet", 3000, "warning")}
                    onOpenSettings={() => snackbar("Not implemented yet", 3000, "warning")}
                    onOpenCardTypes={() => snackbar("Not implemented yet", 3000, "warning")}
                />

                {location.pathname !== "/" && <Sidebar/>}

                <AnimatePresence>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/"
                               element={<LaunchPage onClickGettingStarted={() => navigate("/deck-overview")}/>}/>
                        <Route path="/deck-overview" element={<DeckOverviewPage/>}/>
                        <Route path="/folder/:id" element={<DeckOverviewPage/>}/>
                    </Routes>
                </AnimatePresence>


            </GlobalContext.Provider>

        </ThemeProvider>


    );
}

export default App;
