import {Container, Divider, LinearProgress, List, ListItem, Stack, Typography} from "@mui/material";
import KartAIButton from "../../components/ui/KartAIButton";
import {StaticText} from "../../data/text/staticText";
import {AutoAwesome, Cloud, Devices, Download, Psychology, School, Tune} from "@mui/icons-material";
import {Icons} from '../../assets/asserts';
import {useGlobalContext} from "../../App";
import KartAIBox from "../../components/ui/KartAIBox";
import PageTransitionWrapper from "../../components/animation/PageTransitionWrapper";
import React, {useEffect} from "react";
import TopProgressbar from "../../components/TopProgressbar";
import {
    allRightsReservedText,
    bodyBackground, downloadBox, downloadButton, downloadLabel, featureBox, featureBoxHeadline, featureBoxText,
    firstSection, footer,
    gettingStartedButton,
    headline1,
    headline2, headline3, privacyPolicyText, signInBox,
} from "./styles/launchPageStyles";
import Icon8 from "../../components/Icon8";
import {Settings} from "../../Settings";
import {createDownloadByUrl, windowWidthGreaterThan, windowWidthLessThan} from "../../utils/general";
import AuthenticationSection from "./features/authentication/AuthenticationSection";
import AuthenticationController from "./features/authentication/AuthenticationController";
import {useNavigate} from "react-router-dom";


interface LaunchPageProps {

    onClickGettingStarted(): void
}


export default function ({onClickGettingStarted}: LaunchPageProps) {

    const [isSigningUp, setIsSigningUp] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const {topLevelInitDone, snackbar, loadingBackdrop} = useGlobalContext()
    const navigate = useNavigate()

    useEffect(() => {
        // @ts-ignore
        for (const key of Object.keys(bodyBackground)) {
            // @ts-ignore
            document.body.style[key] = bodyBackground[key]
        }


        return () => {
            // @ts-ignore
            for (const key of Object.keys(bodyBackground)) {
                // @ts-ignore
                document.body.style[key] = ""
            }
        }
    }, [])

    const authController = new AuthenticationController({
        states: {
            isSigningUpState: {val: isSigningUp, set: setIsSigningUp},
            loadingState: {val: isLoading, set: setIsLoading}
        }, snackbar, loadingBackdrop, navigate,
    })

    return <KartAIBox sx={{height: "100%"}} fullWidth>
        <TopProgressbar show={!topLevelInitDone}/>
        <PageTransitionWrapper>
            <KartAIBox hide={Settings.IS_ELECTRON}>
                <KartAIBox fullWidth sx={firstSection}>
                    <KartAIBox gridCenter mt={6} sx={{width: {md: "70%", sm: "90%"}, mx: "auto"}}>
                        <KartAIBox
                            gridCenter={windowWidthLessThan("md")}
                            flexCenter={windowWidthGreaterThan("sm")} spacing={3}>

                            <img src={Icons.KARTAI} alt="kartai-logo" width="192px" height="192px"/>

                            <KartAIBox className="head-line-gradient" gridCenter>
                                <Typography sx={headline1}>{
                                    StaticText.SLOGAN.split(",")[0] + ","
                                }</Typography>

                                <Typography sx={headline1}>{
                                    StaticText.SLOGAN.split(",")[1]
                                }</Typography>
                            </KartAIBox>
                        </KartAIBox>

                        <KartAIBox mt={3}>
                            <Typography sx={headline2}>{StaticText.SUB_SLOGAN}</Typography>
                        </KartAIBox>

                        <KartAIButton disabled={!topLevelInitDone} sx={gettingStartedButton} variant="contained"
                                      color="primary"
                                      onClick={onClickGettingStarted}>
                            {StaticText.GETTING_STARTED}
                        </KartAIButton>

                    </KartAIBox>
                </KartAIBox>

                <KartAIBox mb={5} fullWidth gridCenter>
                    <Typography sx={headline3}>{StaticText.DOWNLOAD_SECTION_TITLE}</Typography>

                    <Stack spacing={2} direction={{xs: 'column', md: 'row'}}>
                        {/* Download für Mac */}
                        <KartAIBox sx={downloadBox}>
                            <Typography sx={downloadLabel}>{StaticText.DOWNLOAD_FOR_MAC}</Typography>

                            <KartAIBox flexSpaceBetween>
                                <Icon8 resolution={500} size={200} category="isometric" name="mac-client"/>
                                <KartAIBox ml={2}>
                                    <KartAIButton mb={2} startIcon={<Download fontSize="large"/>} sx={downloadButton}
                                                  variant="contained"
                                                  color="primary"
                                                  onClick={() => window.open("https://api.kartai.de/KartAI-1.0.0-arm64.dmg")}
                                    >
                                        {StaticText.DOWNLOAD}
                                    </KartAIButton>
                                    <Typography
                                        sx={featureBoxText}>{StaticText.DOWNLOAD_FOR_MAC_DESCRIPTION} </Typography>

                                </KartAIBox>
                            </KartAIBox>
                        </KartAIBox>

                        {/* Download für Windows */}
                        <KartAIBox sx={downloadBox}>
                            <Typography sx={downloadLabel}>{StaticText.DOWNLOAD_FOR_WINDOWS}</Typography>
                            <KartAIBox flexSpaceBetween>
                                <Icon8 resolution={500} size={200} category="isometric" name="windows-client"/>
                                <KartAIBox ml={2}>
                                    <KartAIButton mb={2} startIcon={<Download fontSize="large"/>} sx={downloadButton}
                                                  variant="contained"
                                                  color="primary"
                                                  onClick={() => window.open("https://api.kartai.de/KartAI%20Setup%201.0.0.exe")}
                                    >
                                        {StaticText.DOWNLOAD}
                                    </KartAIButton>
                                    <Typography
                                        sx={featureBoxText}>{StaticText.DOWNLOAD_FOR_WINDOWS_DESCRIPTION}</Typography>
                                </KartAIBox>
                            </KartAIBox>
                        </KartAIBox>
                    </Stack>
                </KartAIBox>

                <KartAIBox mt={3} mb={10} fullWidth gridCenter>
                    <Typography sx={headline3}>{StaticText.FEATURES}</Typography>

                    <Stack spacing={2} direction={{xs: 'column', md: 'row'}}>
                        <KartAIBox sx={featureBox}>
                            <KartAIBox mb={1} flexStart spacing={2}>
                                <Icon8 category="3d-fluency" name="cloud-storage"/>

                                <Typography sx={featureBoxHeadline}>
                                    {StaticText.KARTAI_CLOUD}
                                </Typography>
                            </KartAIBox>

                            <Typography sx={featureBoxText}>
                                {StaticText.KARTAI_CLOUD_DESCRIPTION}
                            </Typography>


                        </KartAIBox>

                        <KartAIBox sx={featureBox}>
                            <KartAIBox mb={1} flexStart spacing={2}>
                                <Icon8 category="3d-fluency" name="knowledge-sharing"/>
                                <Typography sx={featureBoxHeadline}>
                                    {StaticText.EFFICIENT_LEARNING_ALGORITHMS_FEATURE}
                                </Typography>
                            </KartAIBox>

                            <Typography sx={featureBoxText}>
                                {StaticText.EFFICIENT_LEARNING_ALGORITHMS_FEATURE_TEXT}
                            </Typography>

                        </KartAIBox>

                        <KartAIBox sx={featureBox}>
                            <KartAIBox mb={1} flexStart spacing={2}>
                                <Icon8 category="3d-fluency" name="robot-1"/>
                                <Typography sx={featureBoxHeadline}>
                                    {StaticText.AI_CARDS}
                                </Typography>
                            </KartAIBox>

                            <Typography sx={featureBoxText}>
                                {StaticText.AI_DESCRIPTION}
                            </Typography>
                        </KartAIBox>
                    </Stack>

                </KartAIBox>


                <Divider/>

                <KartAIBox sx={footer}>
                    <KartAIBox mt={1} flexStart spacing={4}>
                        <Typography onClick={() => window.open(Settings.PRIVACY_POLICY_LINK)} sx={privacyPolicyText}>
                            {StaticText.PRIVACY_POLICY}
                        </Typography>

                        <Typography onClick={() => window.open(Settings.LEGAL_NOTICE_LINK)} sx={privacyPolicyText}>
                            {StaticText.LEGAL_NOTICE}
                        </Typography>

                    </KartAIBox>

                    <KartAIBox flexSpaceBetween mt={1}>
                        <Typography sx={allRightsReservedText}> © 2024
                            KartAI. {StaticText.ALL_RIGHTS_RESERVED}</Typography>

                        <Typography sx={allRightsReservedText}>
                            {StaticText.ICONS_BY}: <a href="https://icons8.com" target="_blank" rel="noreferrer">
                            Icons8
                        </a>, <a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer">
                            Google Fonts
                        </a>


                        </Typography>
                    </KartAIBox>
                </KartAIBox>


            </KartAIBox>

            <KartAIBox gridCenter mt={10} hide={!Settings.IS_ELECTRON || !topLevelInitDone}>
                <KartAIBox sx={signInBox} styled>
                    <AuthenticationSection controller={authController}/>
                </KartAIBox>
            </KartAIBox>

        </PageTransitionWrapper>
    </KartAIBox>
}