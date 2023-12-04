import Deck from "./dbmodel/Deck";
import Directory from "./dbmodel/Directory";
import Card from "./dbmodel/Card";
import Field from "./dbmodel/Field";
import FieldContent from "./dbmodel/FieldContent";
import CardType from "./dbmodel/CardType";
import CardTypeVariant from "./dbmodel/CardTypeVariant";
import SharedItem from "./dbmodel/SharedItem";


export default interface EntityTypeMap {
    directories: Directory,
    decks: Deck,
    cards: Card,
    fields: Field,
    fieldContents: FieldContent,
    cardTypes: CardType,
    cardTypeVariants: CardTypeVariant,
    sharedItems: SharedItem
}