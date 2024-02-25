import {SxProps} from "@mui/system";

export const bodyBackground: SxProps = {
    backgroundColor: "#F9F9F9"
}

export const firstSection: SxProps = {
    background: "linear-gradient(0deg, rgba(33,143,130,0.36320465686274506) 5%, rgba(255,255,255,1) 80%)",
    p: 4,
    pb: 40,
    width: "100%",
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
    "@media (max-width: 600px)": {
        pb: 20,
    },
}


export const headline1: SxProps = {
    fontSize: 75,
    fontWeight: 900,
    mb: -2,
    "@media (max-width: 600px)": {
        overflow: "hidden",
        wordBreak: "keep-all",
        fontSize: 50,
        mb: 1,
    },
}


export const headline2: SxProps = {
    fontSize: 30,
    color: "#79797A",
    my: 5,
    overflow: "hidden",
    "@media (max-width: 600px)": {
        fontSize: 25,
        textAlign: "block"
    },
}

export const headline3: SxProps = {
    fontSize: 50,
    fontWeight: 600,
    my: 5,
}


export const gettingStartedButton: SxProps = {
    fontSize: 30,
    fontWeight: 550,
    px: 3,
    background: "linear-gradient(90deg, rgba(33,143,130,1) 35%, rgba(33,101,143,1) 100%)"
}

export const downloadButton: SxProps = {
    fontSize: 25,
    fontWeight: 550,
    background: "linear-gradient(180deg, rgba(33,143,130,1) 35%, rgba(33,101,143,1) 100%)",
    px: 3,
    py: -1,
}

export const featureBox: SxProps = {
    borderRadius: "15px",
    width: {md: 380, xs: 380, sm: 200},
    backgroundColor: "#FFFFFF",
    py: 2,
    px: 4
}

export const featureBoxHeadline: SxProps = {
    fontSize: 25,
    fontWeight: 600,
}

export const featureBoxText: SxProps = {
    fontSize: 20,
}

export const allRightsReservedText: SxProps = {
    fontSize: 15,
    color: "#79797A",
}

export const privacyPolicyText: SxProps = {
    fontSize: 17,
    fontWeight: 600,
}

export const footer: SxProps = {
    mx: 2
}

export const downloadBox: SxProps = {
    borderRadius: "15px",
    width: {md: 570, xs: 380, sm: 380},
    backgroundColor: "#FFFFFF",
    py: 2,
    px: 4
}

export const downloadLabel: SxProps = {
    fontSize: 25,
    fontWeight: 600,
}

export const signInBox: SxProps = {
    maxWidth: 500
}

