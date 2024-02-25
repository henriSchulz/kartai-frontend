//@ts-ignore
import Google from "./Google_Logo.png"

//@ts-ignore
import KartAI from "./icon-192x192.png"

//@ts-ignore
import Craft from "./craft_icon.png"

//@ts-ignore
import Computer from "./computer.png"


export class Icons {
    public static GOOGLE = Google

    public static KARTAI = KartAI

    public static CRAFT = Craft

    public static getIcon8(category: string, name: string, size: number = 94) {
        return `https://img.icons8.com/${category}/${size}/${name}`
    }

}

export class Svg {
    public static ARROW_DOWN = "<svg fill=\"#000000\" height=\"30px\" width=\"30px\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n\t viewBox=\"0 0 330 330\" xml:space=\"preserve\">\n<path id=\"XMLID_337_\" d=\"M253.858,234.26c-2.322-5.605-7.792-9.26-13.858-9.26h-60V15c0-8.284-6.716-15-15-15\n\tc-8.284,0-15,6.716-15,15v210H90c-6.067,0-11.537,3.655-13.858,9.26c-2.321,5.605-1.038,12.057,3.252,16.347l75,75\n\tC157.322,328.536,161.161,330,165,330s7.678-1.464,10.607-4.394l75-75C254.896,246.316,256.18,239.865,253.858,234.26z M165,293.787\n\tL126.213,255h77.573L165,293.787z\"/>\n</svg>"
}

