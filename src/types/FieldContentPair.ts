import FieldContent from "./dbmodel/FieldContent";
import Field from "./dbmodel/Field";

export default interface FieldContentPair {
    field: Field
    fieldContent: FieldContent
}