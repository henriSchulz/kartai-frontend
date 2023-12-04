import {Container, Divider, List, ListItem, Stack, Typography} from "@mui/material";
import KartAIButton from "../components/ui/KartAIButton";
import {StaticText} from "../data/text/staticText";
import {AutoAwesome, Cloud, Devices, Psychology, School, Tune} from "@mui/icons-material";
import {Icons} from '../asserts/asserts';
import {useGlobalContext} from "../App";
import KartAIBox from "../components/ui/KartAIBox";
import PageTransitionWrapper from "../components/animation/PageTransitionWrapper";


interface LaunchPageProps {

    onClickGettingStarted(): void
}

const boxWidth = {md: 900, sm: 700, xs: 380}

const smallBoxWidth = {xs: 380, sm: 290}

export default function ({onClickGettingStarted}: LaunchPageProps) {

    const {topLevelInitDone} = useGlobalContext()

    return <KartAIBox>
        <PageTransitionWrapper>
            <KartAIBox gridCenter sx={{mt: 4}}>
                <KartAIBox gridCenter styled sx={{width: boxWidth, p: 3, mb: 2}}>

                    <KartAIBox flexCenter sx={{gap: 2}}>
                        <img height={60} width={60} src={Icons.KARTAI}/>
                        <Typography variant="h3">KartAI</Typography>
                    </KartAIBox>
                    <Typography variant="h5">{StaticText.SLOGAN}</Typography>

                    <KartAIButton disabled={!topLevelInitDone} onClick={onClickGettingStarted}
                                  sx={{px: 3, py: 1, width: 200, mt: 4, fontSize: 20}}
                                  variant="contained">{StaticText.GETTING_STARTED}</KartAIButton>

                </KartAIBox>

                <KartAIBox sx={{width: boxWidth, mb: 2}}>
                    <Stack spacing={2} direction={{xs: 'column', md: 'row'}}>
                        <KartAIBox sx={{width: smallBoxWidth, p: 2}} styled>
                            <KartAIBox flexCenter>
                                <School fontSize="large"/>
                                <Typography sx={{fontWeight: 550, ml: 2}}
                                            variant="h5">{StaticText.LEARN_ANYTHING}</Typography>
                            </KartAIBox>
                            <Typography>{StaticText.LEARN_ANYTHING_DESCRIPTION}</Typography>
                        </KartAIBox>
                        <KartAIBox sx={{width: smallBoxWidth, p: 2}} styled>
                            <KartAIBox flexCenter>
                                <Devices fontSize="large"/>
                                <Typography sx={{fontWeight: 550, ml: 2}}
                                            variant="h5">{StaticText.LEARN_ANYWHERE}</Typography>
                            </KartAIBox>
                            <Typography>{StaticText.LEARN_ANYWHERE_DESCRIPTION}</Typography>
                        </KartAIBox>
                        <KartAIBox sx={{width: smallBoxWidth, p: 2}} styled gridCenter>
                            <KartAIBox flexCenter>
                                <Psychology fontSize="large"/>
                                <Typography sx={{fontWeight: 550, ml: 1}}
                                            variant="h5">{StaticText.LEARN_EFFICIENTLY}</Typography>
                            </KartAIBox>
                            <Typography>{StaticText.LEARN_EFFICIENTLY_DESCRIPTION}</Typography>
                        </KartAIBox>
                    </Stack>
                </KartAIBox>

                <KartAIBox gridCenter styled sx={{width: boxWidth, p: 3, mb: 2}}>
                    <Typography variant="h4">{StaticText.ABOUT_KARTAI}</Typography>
                    <Typography>{StaticText.KARTAI_DESCRIPTION}</Typography>
                    <List sx={{listStyleType: 'disc'}}>
                        <ListItem sx={{display: 'list-item', ml: 4}}>{StaticText.LEARN_LANGUAGE_VOCABULARY}</ListItem>
                        <ListItem sx={{display: 'list-item', ml: 4}}>{StaticText.LEARN_SCIENTIFIC_CONCEPTS}</ListItem>
                        <ListItem
                            sx={{display: 'list-item', ml: 4}}>{StaticText.IMPROVE_GEOGRAPHICAL_KNOWLEDGE}</ListItem>
                    </List>
                </KartAIBox>
                <KartAIBox sx={{width: boxWidth, mb: 2}}>
                    <Stack spacing={2} direction={{xs: 'column', md: 'row'}}>
                        <KartAIBox sx={{width: smallBoxWidth, p: 2}} styled gridStart>
                            <KartAIBox flexCenter>
                                <Cloud fontSize="large"/>
                                <Typography sx={{fontWeight: 550, ml: 2}}
                                            variant="h5">{StaticText.CLOUD_SYNC}</Typography>
                            </KartAIBox>
                            <Typography>{StaticText.CLOUD_SYNC_DESCRIPTION}</Typography>
                        </KartAIBox>
                        <KartAIBox sx={{width: smallBoxWidth, p: 2}} styled gridStart>
                            <KartAIBox flexCenter>
                                <AutoAwesome fontSize="large"/>
                                <Typography sx={{fontWeight: 550, ml: 2}} variant="h5">{StaticText.AI}</Typography>
                            </KartAIBox>
                            <Typography>{StaticText.AI_DESCRIPTION}</Typography>

                        </KartAIBox>
                        <KartAIBox sx={{width: smallBoxWidth, p: 2}} styled gridStart>
                            <KartAIBox flexCenter>
                                <Tune fontSize="large"/>
                                <Typography sx={{fontWeight: 550, ml: 2}}
                                            variant="h5">{StaticText.CUSTOMIZATION_OPTIONS}</Typography>
                            </KartAIBox>
                            <Typography>{StaticText.CUSTOMIZATION_DESCRIPTION}</Typography>
                        </KartAIBox>
                    </Stack>
                </KartAIBox>
                <Divider sx={{width: boxWidth, mb: 2}}/>
                <KartAIBox flexSpaceBetween sx={{
                    width: boxWidth,
                    placeSelf: "bottom",
                    mb: 7
                }}>
                    <Typography
                        //onClick={() => window.open(Settings.PRIVACY_POLICY_LINK)}
                        component="span" color="secondary"
                        sx={{
                            fontSize: 18,
                            "&:hover": {
                                textDecoration: "underline"
                            }
                        }}>{StaticText.PRIVACY_POLICY}</Typography>
                    <Typography
                        //onClick={() => window.open(Settings.LEGAL_NOTICE_LINK)}
                        component="span"
                        color="secondary"
                        sx={{
                            fontSize: 18,
                            "&:hover": {
                                textDecoration: "underline"
                            }
                        }}>{StaticText.LEGAL_NOTICE}</Typography>
                </KartAIBox>
            </KartAIBox>
        </PageTransitionWrapper>
    </KartAIBox>
}