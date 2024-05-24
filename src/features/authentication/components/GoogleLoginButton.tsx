import {Icons} from "../../../assets/asserts";
import {StaticText} from "../../../data/text/staticText";
import KartAIButton from "../../../components/ui/KartAIButton";
import React from "react";
import KartAIBox from "../../../components/ui/KartAIBox";
import {Typography} from "@mui/material";


interface GoogleLoginButtonProps {
    loading: boolean
    onClick: () => void
}

export default function ({loading, onClick}: GoogleLoginButtonProps) {
    return <KartAIButton sx={{py: 1, px: 2}} variant="outlined"
                         disabled={loading}
                         fullWidth
                         onClick={onClick}>
        <KartAIBox mr={1} flexCenter>
            <img alt="Google Logo" style={{height: "2rem", width: "2rem", marginRight: "10px"}}
                 src={Icons.GOOGLE}/>
            <Typography sx={{fontSize: 23}}>{StaticText.CONTINUE_WITH_GOOGLE}</Typography>


        </KartAIBox>
    </KartAIButton>
}