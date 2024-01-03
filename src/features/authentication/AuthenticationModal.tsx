import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import {Box, Button, CircularProgress, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthenticationController from "./AuthenticationController";
import KartAIModal from "../../components/KartAIModal";
import {StaticText} from "../../data/text/staticText";
import KartAIButton from "../../components/ui/KartAIButton";
import {Icons} from "../../asserts/asserts";
import KartAITextField from "../../components/ui/KartAITextField";
import KartAIBox from "../../components/ui/KartAIBox";
import {Settings} from "../../Settings";


interface AuthenticationModalProps {
    controller: AuthenticationController
}

export default function ({controller}: AuthenticationModalProps) {

    const navigate = useNavigate()


    const isSigningUp = controller.states.isSigningUpState.val

    return <KartAIBox>
        <KartAIModal
            loading={controller.states.loadingState.val}
            show={controller.states.showState.val}
            title={isSigningUp ? StaticText.SIGN_UP : StaticText.SIGN_IN}
            submitButtonText={isSigningUp ? StaticText.SIGN_UP : StaticText.SIGN_IN}
            hideButtons

        >
            <KartAIBox>
                {isSigningUp && <>
                    <KartAIButton variant="outlined"
                                  disabled={controller.states.loadingState.val}
                                  fullWidth
                                  onClick={controller.onSignInWithGoogle}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "5px"
                        }}>
                            <img alt="Google Logo" style={{height: 40, width: 40, marginRight: "10px"}}
                                 src={Icons.GOOGLE}/>
                            <span
                                className="font-medium">{StaticText.CONTINUE_WITH_GOOGLE}</span>
                        </div>
                    </KartAIButton>

                    <Typography sx={{textAlign: "center", my: 2}}>{StaticText.OR}</Typography>


                    <KartAITextField sx={{mb: 1}}
                                     id="sign-up-email"
                                     label={StaticText.EMAIL}
                                     fullWidth
                                     variant="filled"
                                     type="email"/>


                    <KartAITextField label={StaticText.PASSWORD} sx={{mb: 1}}
                                     id="sign-up-password"
                                     fullWidth variant="filled"
                                     type="password"/>


                    <KartAITextField label={StaticText.CONFIRM_PASSWORD}
                                     sx={{mb: 1}}
                                     id="sign-up-confirm-password"
                                     fullWidth variant="filled"
                                     type="password"/>

                    <KartAIButton loading={controller.states.loadingState.val} sx={{my: 2}} fullWidth
                                  onClick={controller.onSubmit}
                                  variant="contained">
                        {StaticText.SIGN_UP}
                    </KartAIButton>

                    <KartAIBox>
                        {StaticText.PRIVACY_POLICY_INFO}
                        <a style={{
                            color: "#21658F",
                            textDecoration: "underline",
                            cursor: "pointer"
                        }} onClick={() => window.open(Settings.PRIVACY_POLICY_LINK)}>{StaticText.PRIVACY_POLICY}</a>
                    </KartAIBox>

                    <KartAIBox mt={2} sx={{textAlign: "center"}} flexCenter>
                        <span style={{marginRight: "10px"}}>{StaticText.ALREADY_HAS_ACCOUNT}</span>
                        <a onClick={() => controller.states.isSigningUpState.set(false)} style={{
                            color: "#21658F",
                            textDecoration: "underline",
                            cursor: "pointer"
                        }}>{StaticText.SIGN_IN}</a>
                    </KartAIBox>

                </>}

                {!isSigningUp && <>
                    <KartAIButton variant="outlined"
                                  disabled={controller.states.loadingState.val}
                                  fullWidth
                                  onClick={controller.onSignInWithGoogle}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "5px"
                        }}>
                            <img alt="Google Logo" style={{height: 40, width: 40, marginRight: "10px"}}
                                 src={Icons.GOOGLE}/>
                            <span
                                className="font-medium">{StaticText.CONTINUE_WITH_GOOGLE}</span>


                        </div>
                    </KartAIButton>

                    <Typography sx={{textAlign: "center", my: 2}}>{StaticText.OR}</Typography>

                    <KartAITextField sx={{mb: 1}}
                                     id="sign-in-email"
                                     label={StaticText.EMAIL}
                                     fullWidth
                                     variant="filled"
                                     type="email"/>


                    <KartAITextField label={StaticText.PASSWORD} sx={{mb: 1}}
                                     id="sign-in-password"
                                     fullWidth variant="filled"
                                     type="password"/>

                    <KartAIButton loading={controller.states.loadingState.val} sx={{my: 2}} fullWidth
                                  onClick={controller.onSubmit}
                                  variant="contained">
                        {StaticText.SIGN_IN}
                    </KartAIButton>


                    <KartAIBox mt={2} sx={{textAlign: "center"}} flexCenter>
                        <span style={{marginRight: "10px"}}>{StaticText.NO_ACCOUNT}</span>
                        {/*<Image height={30} width={30} src={userData.imgUrl} roundedCircle/>*/}
                        <a onClick={() => controller.states.isSigningUpState.set(true)} style={{
                            color: "#21658F",
                            textDecoration: "underline",
                            cursor: "pointer"
                        }}>{StaticText.SIGN_UP}</a>
                    </KartAIBox>

                </>}
            </KartAIBox>
        </KartAIModal>
    </KartAIBox>
}