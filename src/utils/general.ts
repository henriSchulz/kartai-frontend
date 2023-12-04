import Breakpoint from "../types/Breakpoint";

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

export function showCardTypesOption(pathname: string) {
    const isTable = /\/deck\/[^/]+\/(table)/.test(pathname)
    const isDeckPage = /\/deck\/[^/]+/.test(pathname)

    return isTable || isDeckPage
}


export const windowWidthGreaterThan = (b: Breakpoint) => {
    const h: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"]
    return h.indexOf(getWindowWidth()) > h.indexOf(b)
}

export const windowWidthLessThan = (b: Breakpoint) => {
    const h: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"]
    return h.indexOf(getWindowWidth()) < h.indexOf(b)
}

export function generateModelId() {
    const characters = 'abcdef0123456789';
    const idLength = 36;
    let id = '';

    for (let i = 0; i < idLength; i++) {
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