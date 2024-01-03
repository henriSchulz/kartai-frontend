import Breakpoint from "../types/Breakpoint";



export const ID_PROPERTIES = {
    length: 16,
    characters: 'abcdefghijklmnopqrstuvwxyz0123456789'
}

export function getWindowWidth(): Breakpoint {
    if (window.innerWidth < 600) {
        return "xs"
    }

    if (window.innerWidth < 900) {
        return "sm"
    }

    if (window.innerWidth < 1200) {
        return "md"
    }

    if (window.innerWidth < 1539) {
        return "lg"
    }

    return "xl"
}

export function isXsWindow() {
    return getWindowWidth() === "xs"
}


export const windowWidthGreaterThan = (b: Breakpoint) => {
    const h: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"]
    return h.indexOf(getWindowWidth()) > h.indexOf(b)
}

export const windowWidthLessThan = (b: Breakpoint) => {
    const h: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"]
    return h.indexOf(getWindowWidth()) < h.indexOf(b)
}

export function generateModelId(length: number = ID_PROPERTIES.length) {
    const characters = ID_PROPERTIES.characters
    let id = '';

    for (let i = 0; i < length; i++) {
        id += characters[Math.floor(Math.random() * characters.length)];
    }
    return id;
}

export function createDownload(fileName: string, fileContent: string): void {
    const blob = new Blob([fileContent], {type: "text/plain"});
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
}

export function formatDuration(timestamp: number): string {
    const millisecondsPerSecond = 1000;
    const millisecondsPerMinute = 1000 * 60;
    const millisecondsPerHour = millisecondsPerMinute * 60;
    const millisecondsPerDay = millisecondsPerHour * 24;

    const days = Math.floor(timestamp / millisecondsPerDay);
    const hours = Math.floor((timestamp % millisecondsPerDay) / millisecondsPerHour);
    const minutes = Math.floor((timestamp % millisecondsPerHour) / millisecondsPerMinute);
    const seconds = Math.floor((timestamp % millisecondsPerMinute) / millisecondsPerSecond);


    if (days === 0 && hours === 0) {
        if (minutes === 0) {
            return `${seconds}s`
        } else {
            return `${minutes}m`
        }
    }

    if (days === 0) {
        if (minutes === 0) {
            return `${hours}h`
        } else return `${hours}h ${minutes}m`
    }


    return `${days}d ${hours}h ${minutes}m`;
}


export function shuffleArray<T>(a: T[]): T[] {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function numberArray(from: number, to: number) {
    const list = [];
    for (let i = from; i <= to; i++) {
        list.push(i);
    }
    return list
}

export function getTextFieldValue(id: string): string | undefined {
    const element = document.getElementById(id) as HTMLInputElement
    if(!element) return undefined
    return element.value
}

export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRandomElements<T>(arr: T[], num: number): T[] {
    const result: T[] = [];
    const indices: Set<number> = new Set();

    while (result.length < num) {
        const index: number = Math.floor(Math.random() * arr.length);
        if (!indices.has(index)) {
            indices.add(index);
            result.push(arr[index]);
        }
    }

    return result;
}

