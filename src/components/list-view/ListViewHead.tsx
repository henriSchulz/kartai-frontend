import KartAIBox from "../ui/KartAIBox";
import {Breadcrumbs, Stack, Typography} from "@mui/material";
import Directory from "../../types/dbmodel/Directory";
import React from "react";
import {StaticText} from "../../data/text/staticText";
import {StyledBreadcrumb} from "../StyledBreadcrumb";
import HomeIcon from "@mui/icons-material/Home";
import {useNavigate} from "react-router-dom";
import KartAIButton from "../ui/KartAIButton";
import {getWindowWidth} from "../../utils/general";
import {listViewHeader} from "../../styles/listView";
import {Folder} from "@mui/icons-material";

interface ListViewHeadProps {
    title?: string
    breadcrumbs?: Directory[]
    icon: React.ReactNode,
    rightActionButton?: {
        text: string, onClick: () => void, icon: React.ReactNode
    },
    loading?: boolean
}

export default function (props: ListViewHeadProps) {
    const navigate = useNavigate()


    return <KartAIBox sx={listViewHeader}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={2}>
                {props.icon}
                <Typography variant="h4">{props.title}</Typography>
            </Stack>

            {props.rightActionButton &&
                <KartAIButton disabled={props.loading} startIcon={props.rightActionButton.icon}
                              size={getWindowWidth() === "xs" ? "small" : "large"} variant="outlined"
                              onClick={props.rightActionButton.onClick}>
                    {props.rightActionButton.text} </KartAIButton>
            }
        </Stack>

        {props.breadcrumbs && <Stack sx={{mt: 1}} direction="row" justifyContent="start" alignItems="center">
            <Breadcrumbs maxItems={7}>
                <StyledBreadcrumb icon={<HomeIcon/>} label={StaticText.HOME_MENU}
                                  onClick={() => navigate("/deck-overview")}/>
                {props.breadcrumbs.map((directory, index) => {
                    return <StyledBreadcrumb icon={<Folder/>} key={directory.id} label={directory.name}
                                             onClick={() => navigate("/folder/" + directory.id)}/>
                })}
            </Breadcrumbs>
        </Stack>}


    </KartAIBox>
}