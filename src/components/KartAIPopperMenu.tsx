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
}


export default function (props: KartAIPopperMenuProps) {
    return <Popper
        open={props.show}
        anchorEl={props.anchorEl}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
    >
        {({TransitionProps, placement}) => (
            <Grow
                {...TransitionProps}
                style={{
                    transformOrigin:
                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                }}
            >
                <Paper>
                    <ClickAwayListener onClickAway={props.onClose}>
                        <MenuList autoFocusItem={props.show}>
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
                    </ClickAwayListener>
                </Paper>
            </Grow>
        )}
    </Popper>
}

