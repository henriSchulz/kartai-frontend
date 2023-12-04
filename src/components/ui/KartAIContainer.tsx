import {windowWidthGreaterThan} from "../../utils/general";
import KartAIBox from "./KartAIBox";
import React from "react";

interface KartAIContainerProps {
    children?: React.ReactNode

}


export default function KartAIContainer(props: KartAIContainerProps) {
    return (
        <KartAIBox gridCenter sx={{ml: `${windowWidthGreaterThan("md") ? 240 : 0}px`, mt: 3}}>
            {props.children}
        </KartAIBox>
    )
}