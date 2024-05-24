// @ts-ignore
import H1 from "./format_h1_FILL0_wght400_GRAD0_opsz24.svg"
// @ts-ignore
import H2 from "./format_h2_FILL0_wght400_GRAD0_opsz24.svg"
// @ts-ignore
import H3 from "./format_h3_FILL0_wght400_GRAD0_opsz24.svg"
// @ts-ignore
import H4 from "./format_h4_FILL0_wght400_GRAD0_opsz24.svg"
// @ts-ignore
import H5 from "./format_h5_FILL0_wght400_GRAD0_opsz24.svg"
// @ts-ignore
import H6 from "./format_h6_FILL0_wght400_GRAD0_opsz24.svg"

interface FormatHeadlineProps {
    type: number
}

export default function (props: FormatHeadlineProps) {

    const icons = [H1, H2, H3, H4, H5, H6]

    return <img src={icons[props.type - 1]} alt={`Headline ${props.type}`}/>

}