import {Drawer, MenuItem, ListItemIcon, ListItemText, Toolbar, List, Divider} from "@mui/material";
import {Home, Notes as NoteStack, AnalyticsOutlined, Public, HomeOutlined} from "@mui/icons-material";
import {StaticText} from "../data/text/staticText";
import {useNavigate} from "react-router-dom";
import {useGlobalContext} from "../App";


export default function () {
    const navigate = useNavigate()
    const {snackbar} = useGlobalContext()
    return <Drawer
        sx={{
            '& .MuiDrawer-paper': {
                width: 240,
                backgroundColor: "transparent",
                backgroundImage: "linear-gradient(to right top, rgba(240, 247, 255, 0.3) 40%, rgba(243, 246, 249, 0.2) 100%)",
                boxShadow: "none",
                borderRight: "1px solid #E4EAF2 !important"
            },
        }}
        variant="permanent" anchor="left">
        <Toolbar/>
        <Toolbar sx={{ml: -3}}>
            <List>
                <MenuItem onClick={() => navigate("/deck-overview")}>
                    <ListItemIcon>
                        <HomeOutlined fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText sx={{ml: 1}}
                                  primaryTypographyProps={{fontSize: '20px'}}
                                  primary={StaticText.DECK_VIEW}
                    />
                </MenuItem>

                <MenuItem onClick={() => snackbar(StaticText.FUNCTION_TEMPORARILY_DISABLED, 4000, "info")}>
                    <ListItemIcon>
                        <AnalyticsOutlined fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText sx={{ml: 1}}
                                  primaryTypographyProps={{fontSize: '20px'}}
                                  primary={StaticText.STATISTICS}
                    />
                </MenuItem>
                <Divider/>
                <MenuItem onClick={() => {
                    navigate("/public-decks")
                }}>
                    <ListItemIcon>
                        <Public fontSize="large"/>
                    </ListItemIcon>
                    <ListItemText sx={{ml: 1}}
                                  primaryTypographyProps={{fontSize: '20px'}}
                                  primary={StaticText.PUBLIC_DECKS}
                    />
                </MenuItem>

            </List>
        </Toolbar>

    </Drawer>
}