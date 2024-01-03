import {LinearProgress} from "@mui/material";
import KartAIBox from "./ui/KartAIBox";
import React, {useEffect} from "react";


interface TopProgressbarProps {
    show: boolean
    timer?: number // in ms
}


export default function ({show, timer}: TopProgressbarProps) {


    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
        if (show && timer) {

            const startTime = Date.now()
            const fn = () => {
                const p = (Date.now() - startTime) / timer
                setProgress(p)
            }

            const id = setInterval(fn, 500)

            return () => {
                clearInterval(id)
            }
        }

    }, [show, timer])

    return <>
        {show && <LinearProgress value={progress*100} variant={timer ? "determinate" : "indeterminate"}
                                 sx={{mt: -1, height: "4px"}}/>}
        <KartAIBox hide={show} sx={{mt: -1, height: "4px"}}/>
    </>
}