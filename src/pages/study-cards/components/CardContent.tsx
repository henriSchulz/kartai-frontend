import KartAIBox from "../../../components/ui/KartAIBox";
import {cardContentStyles} from "../styles/studyCardsStyles";
import FieldContentPair from "../../../types/FieldContentPair";
import CardContentController from "../CardContentController";
import {useMemo} from "react";

interface CardContentProps {
    fieldContentPairs: FieldContentPair[]
    templateFront: string
    templateBack: string
    backHidden: boolean
    unsetHeight?: boolean
}


export default function (props: CardContentProps) {


    const controller = new CardContentController({
        fieldContentPairs: props.fieldContentPairs,
        templateFront: props.templateFront,
        templateBack: props.templateBack,
        backHidden: props.backHidden
    })

    const {front, back} = useMemo(() => ({
        front: controller.getFront(),
        back: controller.getBack()
    }), [props.backHidden, props.fieldContentPairs])

    return <KartAIBox component="div" id="card-content" gridCenter
                      sx={cardContentStyles(controller.calcFontSize(), props.unsetHeight)}>
        <KartAIBox sx={{display: "inline"}} htmlString={front} hide={!props.backHidden}/>
        <KartAIBox sx={{display: "inline"}} htmlString={back} hide={props.backHidden}/>
    </KartAIBox>

}
