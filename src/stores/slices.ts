import Deck from "../types/dbmodel/Deck";
import {getSlice} from "./factory";
import Card from "../types/dbmodel/Card";
import Field from "../types/dbmodel/Field";
import FieldContent from "../types/dbmodel/FieldContent";
import CardType from "../types/dbmodel/CardType";
import CardTypeVariant from "../types/dbmodel/CardTypeVariant";
import Directory from "../types/dbmodel/Directory";
import SharedItem from "../types/dbmodel/SharedItem";


export const decksSlice = getSlice<Deck>("decks")
export const cardsSlice = getSlice<Card>("cards")
export const fieldsSlice = getSlice<Field>("fields")
export const fieldContentsSlice = getSlice<FieldContent>("fieldContents")
export const cardTypesSlice = getSlice<CardType>("cardTypes")
export const cardTypeVariantsSlice = getSlice<CardTypeVariant>("cardTypeVariants")
export const directoriesSlice = getSlice<Directory>("directories")
export const sharedItemsSlice = getSlice<SharedItem>("sharedItems")



