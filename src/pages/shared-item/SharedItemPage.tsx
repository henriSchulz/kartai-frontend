import {useNavigate, useParams} from "react-router-dom";
import KartAIBox from "../../components/ui/KartAIBox";
import PageTransitionWrapper from "../../components/animation/PageTransitionWrapper";
import KartAIContainer from "../../components/ui/KartAIContainer";
import ListView from "../../components/list-view/ListView";
import SharedItemController from "./SharedItemController";
import React, {useEffect, useState} from "react";
import {useGlobalContext} from "../../App";
import ImportExportObject from "../../types/ImportExportObject";
import ListViewHead from "../../components/list-view/ListViewHead";
import {Download, Public} from "@mui/icons-material";
import {StaticText} from "../../data/text/staticText";
import FieldContentPair from "../../types/FieldContentPair";
import {lightBorderColor} from "../../styles/root";
import {Divider, Stack, Typography} from "@mui/material";
import {mediumBoldText} from "../../styles/typography";
import SharedItem from "../../types/dbmodel/SharedItem";
import {deckPageCardsCount} from "../deck/styles/deckPapeStyles";
import KartAIButton from "../../components/ui/KartAIButton";
import {importButton} from "./styles/sharedItemPageStyles";
import SampleCardViewItem from "./components/SampleCardViewItem";
import AuthenticationService from "../../services/AuthenticationService";
import DownloadSharedItemController from "./features/download-shared-item/DownloadSharedItemController";
import DownloadSharedItemModal from "./features/download-shared-item/DownloadSharedItemModal";
import ImportSharedItemController from "./features/import-shared-item/ImportSharedItemController";
import ImportSharedItemModal from "./features/import-shared-item/ImportSharedItemModal";

export default function () {

    const navigate = useNavigate()

    const {id} = useParams()

    const {snackbar} = useGlobalContext()

    const [loading, setLoading] = useState(false)
    const [initDone, setInitDone] = useState(false)
    const [importData, setImportData] = useState<ImportExportObject | null>(null)
    const [sampleFieldContentPairsArray, setSampleFieldContentPairsArray] = useState<FieldContentPair[][]>([[]])
    const [sharedItem, setSharedItem] = useState<SharedItem | null>(null)
    const [selectedDownloadFormat, setSelectedDownloadFormat] = useState<"kpkg" | "csv">("kpkg")
    const [selectedCSVDelimiter, setSelectedCSVDelimiter] = useState<string>("\t")

    const [showDownloadSharedItemModal, setShowDownloadSharedItemModal] = useState(false)
    const [showImportSharedItemModal, setShowImportSharedItemModal] = useState(false)

    const {loadingBackdrop, topLevelInitDone} = useGlobalContext()


    const controller = new SharedItemController({
        id, navigate, loadingBackdrop, states: {
            loadingState: {val: loading, set: setLoading},
            initDoneState: {val: initDone, set: setInitDone},
            importDataState: {val: importData, set: setImportData},
            sampleFieldContentPairsArrayState: {
                val: sampleFieldContentPairsArray,
                set: setSampleFieldContentPairsArray
            },
            sharedItemState: {val: sharedItem, set: setSharedItem}
        }
    })

    const downloadSharedItemController = new DownloadSharedItemController({
        snackbar,
        sharedItemController: controller,
        states: {
            showState: {val: showDownloadSharedItemModal, set: setShowDownloadSharedItemModal},
            selectedExportFormatState: {val: selectedDownloadFormat, set: setSelectedDownloadFormat},
            csvDelimiterState: {val: selectedCSVDelimiter, set: setSelectedCSVDelimiter},
            loadingState: {val: loading, set: setLoading},
        }
    })

    const importSharedItemController = new ImportSharedItemController({
        snackbar, navigate,
        sharedItemController: controller,
        states: {
            loadingState: {val: loading, set: setLoading},
            showState: {val: showImportSharedItemModal, set: setShowImportSharedItemModal},
        }
    })


    useEffect(() => {
        if (!topLevelInitDone) return
        controller.init().then(() => setInitDone(true))
    }, [id, topLevelInitDone])

    const onClickImportOrDownloadButton = () => {
        if (AuthenticationService.current) {
            importSharedItemController.open()
        } else {
            downloadSharedItemController.open()
        }
    }

    const isOwner = AuthenticationService.current?.id === sharedItem?.clientId

    return <KartAIBox>

        {showDownloadSharedItemModal && <DownloadSharedItemModal controller={downloadSharedItemController}/>}
        {showImportSharedItemModal && <ImportSharedItemModal controller={importSharedItemController}/>}

        <PageTransitionWrapper>
            <KartAIContainer>
                <ListView>
                    <ListViewHead title={sharedItem?.sharedItemName} icon={<Public/>} loading={loading || !initDone}/>
                    <Divider sx={{color: lightBorderColor, mb: 3}}/>

                    <KartAIBox flexCenter mt={4}>
                        <KartAIBox gridStart sx={{gridTemplateColumns: "auto auto"}}>
                            <Typography ml={3} sx={mediumBoldText}>{StaticText.OWNER}:</Typography>
                            <Typography ml={3}
                                        sx={deckPageCardsCount("new", false)}>{
                                sharedItem?.clientId !== "mdAxDWkf3ae6DaAI9YJHiM26EpK2" ?
                                    `user@${sharedItem?.clientId?.slice(0, 6)}` : "Timon"
                            }</Typography>
                            <Typography ml={3} sx={mediumBoldText}>{StaticText.CARDS}:</Typography>
                            <Typography ml={3}
                                        sx={deckPageCardsCount("learning", false)}>{importData?.cards?.length ?? 0}</Typography>
                            <Typography ml={3} sx={mediumBoldText}>{StaticText.DOWNLOADS}:</Typography>
                            <Typography ml={3}
                                        sx={deckPageCardsCount("review", false)}>{sharedItem?.downloads ?? 0}</Typography>

                        </KartAIBox>

                        <KartAIButton sx={{cursor: isOwner ? "not-allowed" : "pointer", ...importButton}}
                                      disabled={isOwner}
                                      onClick={onClickImportOrDownloadButton} startIcon={<Download/>}
                                      variant="contained">
                            {AuthenticationService.current ? StaticText.IMPORT : StaticText.DOWNLOAD}
                        </KartAIButton>
                    </KartAIBox>


                    <KartAIBox mt={3}>
                        <KartAIBox mb={2}>
                            <Typography sx={{fontWeight: 550}} alignSelf="start"
                                        variant="h5">{StaticText.SAMPLE_CARDS}</Typography>
                        </KartAIBox>

                        <Stack direction="column" spacing={1}>
                            {sampleFieldContentPairsArray.map((fieldContentPairs, index) => {
                                return <SampleCardViewItem fieldContentPairs={fieldContentPairs} key={index}/>
                            })}
                        </Stack>
                    </KartAIBox>


                </ListView>

            </KartAIContainer>
        </PageTransitionWrapper>

    </KartAIBox>

}