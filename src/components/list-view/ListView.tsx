import {Stack} from "@mui/material";
import {listView} from "../../styles/listView";
import React from "react";

interface ListViewProps {
    children?: React.ReactNode
}

export default function (props: ListViewProps) {
    return <Stack direction="column" sx={listView}>
        {props.children}
    </Stack>
}