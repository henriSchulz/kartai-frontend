import {ItemMenuItem} from "./KartAIItemMenu";
import {
    ClickAwayListener,
    Divider,
    Grow,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper
} from "@mui/material";
import React from "react";

interface KartAIPopperMenuProps {
    show: boolean

    anchorEl: HTMLElement | null

    onClose(): void

    menuItems: ItemMenuItem[]

    orientation?: "top" | "bottom"
}


export default function (props: KartAIPopperMenuProps) {
    return <Popper
        open={props.show}
        anchorEl={props.anchorEl}
        role={undefined}
        placement={props.orientation ? props.orientation === 'top' ? 'top-start' : 'bottom-start' : "bottom-start"}
        transition
        disablePortal
    >
        {({TransitionProps, placement}) => (
            <Grow
                {...TransitionProps}
                style={{
                    transformOrigin:
                        props.orientation ?
                            props.orientation === 'top' ? 'left top' : 'left bottom' :
                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                }}
            >
                <Paper sx={{zIndex: Infinity}}>
                    <ClickAwayListener onClickAway={props.onClose}>
                        <MenuList autoFocusItem={props.show}>
                            {props.menuItems.map((item, index) => {
                                if (item.hidden) {
                                    return <div key={index * Math.random()}></div>
                                }

                                return <div key={index * Math.random()}>
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
                    </ClickAwayListener>
                </Paper>
            </Grow>
        )}
    </Popper>
}

