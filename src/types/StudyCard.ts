import Card from "./dbmodel/Card";
import CardTypeVariant from "./dbmodel/CardTypeVariant";

export default interface StudyCard {
    card: Card
    variant: CardTypeVariant
}