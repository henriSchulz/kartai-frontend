import {ItemMenuItem} from "./KartAIItemMenu";
import {Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList} from "@mui/material";
import React from "react";

interface KartAIContextMenuProps {
    position?: { x: number, y: number } // undefined if not visible
    menuItems: ItemMenuItem[]

    onClose(): void
}

export default function (props: KartAIContextMenuProps) {
    if (!props.position) return <></>

    return <Menu open={true} transitionDuration={250}
                 anchorReference="anchorPosition"
                 onClose={props.onClose}
                 anchorPosition={{top: props.position.y, left: props.position.x}}
    >
        <MenuList>
            {props.menuItems.map((item, index) => {
                if (item.hidden) {
                    return <div key={index * Math.random()}></div>
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


}