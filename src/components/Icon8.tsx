import {Icons} from "../asserts/asserts";

interface Icon8Props {
    category: string
    name: string
    resolution?: number
    size?: number
}

export default function ({category, name, size, resolution}: Icon8Props) {

    return <img src={Icons.getIcon8(category, name, resolution)} alt={`${category}-${name}`} width={size ?? 50}
                height={size ?? 50}/>
}