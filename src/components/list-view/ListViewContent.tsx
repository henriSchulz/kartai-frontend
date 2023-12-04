import {Stack} from "@mui/material";
import {listViewContent, listViewContentFullHeight} from "../../styles/listView";
import React from "react";

interface ListViewContentProps {
    fullHeight?: boolean
    children?: React.ReactNode
}

export default function (props: ListViewContentProps) {
    return <Stack sx={props.fullHeight ? listViewContentFullHeight : listViewContent} spacing={2} direction="column">
        {props.children}
    </Stack>
}