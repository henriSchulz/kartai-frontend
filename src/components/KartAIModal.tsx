import {
    Breakpoint,
    Dialog,
    DialogActions,
    DialogContent,
    Grow,
    IconButton, LinearProgress,
    Paper,
    Slide,
    styled,
    Typography
} from "@mui/material";
import React from "react";
import {TransitionProps} from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import KartAIButton from "./ui/KartAIButton";
import {StaticText} from "../data/text/staticText";

export const StyledBox = styled(Paper)`
  border-radius: 8px;
  border: 1px solid #E4EAF2;
  background-image: linear-gradient(to right top, rgba(240, 247, 255, 0.3) 40%, rgba(243, 246, 249, 0.2) 100%);
`

export const TransitionGrow = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Grow ref={ref} {...props} />;
});

const TransitionSlide = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

interface KartAIModalProps {

    title: string
    show: boolean

    onClose(): void

    onSubmit?(): void

    hideButtons?: boolean

    hideCancelButton?: boolean

    loading?: boolean

    notCancelable?: boolean

    size?: Breakpoint

    transition?: "grow" | "slide"

    children: React.ReactNode

    cancelButtonText?: string

    submitButtonText?: string

    transitionDuration?: number
}

export default function (props: KartAIModalProps) {

    if (!props.show) {
        return <></>
    }

    return <Dialog PaperComponent={StyledBox}
                   open={props.show}
                   onClose={props.notCancelable ? () => "" : props.onClose}
                   aria-labelledby="responsive-dialog-title"
                   maxWidth={props.size ?? "xs"}
                   fullWidth={true}
                   TransitionComponent={props.transition === "slide" ? TransitionSlide : TransitionGrow}
                   transitionDuration={props.transitionDuration ?? 250}
    >

        <Typography sx={{fontWeight: 550, p: 2, fontSize: "1.5rem"}}>
            {props.title}
        </Typography>

        <IconButton
            aria-label="close"
            disabled={props.loading}
            onClick={props.notCancelable ? () => "" : props.onClose}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
        >

        </IconButton>
        <DialogContent dividers>
            {props.children}
        </DialogContent>
        {!props.hideButtons && <DialogActions>
            {!props.hideCancelButton &&
                <KartAIButton variant="outlined"
                              disabled={props.loading || props.notCancelable}
                              onClick={props.onClose}>
                    {props.cancelButtonText ?? StaticText.CANCEL}
                </KartAIButton>}
            <KartAIButton loading={props.loading} loadingText={StaticText.LOADING} variant="outlined"
                          disabled={props.loading} onClick={props.onSubmit ?? props.onClose}>
                {props.submitButtonText ?? StaticText.CONFIRM}
            </KartAIButton>

        </DialogActions>}
    </Dialog>

}