import React from "react";
import {Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Popper} from "@mui/material";
import KartAIBox from "./ui/KartAIBox";


export interface ItemMenuItem {
    text: string,
    icon: React.ReactNode,

    onClick(): void,

    hidden?: boolean,
    dividerUnderneath?: boolean
}

interface ItemMenuProps {
    show: boolean

    anchorEl: HTMLElement | null

    onClose(): void

    menuItems: ItemMenuItem[]
}


export default function (props: ItemMenuProps) {

    return (
        <Menu
            open={props.show}
            keepMounted={false}
            anchorEl={props.anchorEl}
            transitionDuration={250}
            onClose={props.onClose}
        >
            <MenuList sx={{width: 200}}>
                {props.menuItems.map((item, index) => {
                    if (item.hidden) {
                        return <div key={index}></div>
                    }

                    return <div key={index}>
                        <MenuItem onClick={() => {
                            item.onClick()
                            props.onClose()
                        }}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText>{item.text}</ListItemText>
                        </MenuItem>
                        {item.dividerUnderneath && <Divider/>}
                    </div>
                })}
            </MenuList>

        </Menu>
    )
}