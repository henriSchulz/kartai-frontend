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
import KartAIBox from "./ui/KartAIBox";

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

    onClose?(): void

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

    actionButton?: {
        text: string
        icon?: React.ReactNode
        onClick(): void
    }
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

        <KartAIBox flexSpaceBetween>
            <Typography sx={{fontWeight: 550, p: 2, fontSize: "1.5rem"}}>
                {props.title}
            </Typography>

            <IconButton sx={{m: 2}} onClick={props.onClose}>
                <CloseIcon/>
            </IconButton>
        </KartAIBox>
        <DialogContent dividers>
            {props.children}
        </DialogContent>
        {!props.hideButtons && <DialogActions>
            <KartAIBox flexSpaceBetween fullWidth>
                {props.actionButton ?
                    <KartAIButton color="secondary"
                                  startIcon={props.actionButton.icon}
                                  onClick={props.actionButton.onClick}
                                  sx={{ml: 2}}
                                  variant="outlined">
                        {props.actionButton.text}
                    </KartAIButton>
                    : <div style={{visibility: "hidden"}}></div>}

                <KartAIBox>
                    {!props.hideCancelButton &&
                        <KartAIButton variant="outlined"
                                      disabled={props.loading || props.notCancelable}
                                      onClick={props.onClose}>
                            {props.cancelButtonText ?? StaticText.CANCEL}
                        </KartAIButton>}
                    <KartAIButton ml={1} loading={props.loading} loadingText={StaticText.LOADING} variant="outlined"
                                  disabled={props.loading} onClick={props.onSubmit ?? props.onClose}>
                        {props.submitButtonText ?? StaticText.CONFIRM}
                    </KartAIButton>
                </KartAIBox>
            </KartAIBox>


        </DialogActions>}
    </Dialog>

}