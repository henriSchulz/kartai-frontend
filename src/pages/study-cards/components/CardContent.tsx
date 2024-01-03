import KartAIBox from "../../../components/ui/KartAIBox";
import {cardContentStyles} from "../styles/studyCardsStyles";
import FieldContentPair from "../../../types/FieldContentPair";
import CardContentController from "../CardContentController";

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

    return <KartAIBox gridCenter sx={cardContentStyles(controller.calcFontSize(), props.unsetHeight)}>
        <KartAIBox gridCenter htmlString={controller.getFront()} hide={!props.backHidden}/>
        <KartAIBox gridCenter htmlString={controller.getBack()} hide={props.backHidden}/>
    </KartAIBox>

}
