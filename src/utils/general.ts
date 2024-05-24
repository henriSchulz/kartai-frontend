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

export function createDownloadByUrl(url: string, filename: string): void {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        })
        .catch(console.error);
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


    return `${days !== 0 ? `${days}d` : ""} ${hours !== 0 ? `${hours}h` : ""}${minutes !== 0 ? `${minutes}m` : ""}`;
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
    if (!element) return undefined
    return element.value
}

export function getCheckBoxValue(id: string): boolean {
    const element = document.getElementById(id) as HTMLInputElement
    if (!element) return false
    return element.checked
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

export function markdownToCsv(
    markdown: string,
    options: {
        hasHeader?: boolean;
    } = {}
): string[][] {
    // Split the markdown string into lines
    const lines = markdown.split('\n');

    // Get the header line if it exists
    const headerLine = options.hasHeader && lines.length > 0 ? lines.shift() : undefined;

    lines.shift();

    // Create a new array to store the CSV data
    const csvData: string[][] = [];

    // Iterate over the lines
    for (const line of lines) {
        // Split the line into columns
        const columns = line.split('|');

        // Remove any empty columns and trim whitespace from each column
        const filteredColumns = columns
            .filter(column => column !== '')
            .map(column => column.trim());

        // Add the columns to the CSV data array
        if (filteredColumns.length > 0)
            csvData.push(filteredColumns);
    }

    // Return the CSV data as a two-dimensional array
    return csvData;
}

export function getLastActiveTextArea(): HTMLTextAreaElement | null {
    return window.lastActiveTextArea;
}

export function insertImage() {
    const currentInput = getLastActiveTextArea()
    if (!currentInput) return
    const selectedText = window.lastTextSelection

    const inputText = currentInput.value
    const selectionStart = currentInput.selectionStart!
    const selectionEnd = currentInput.selectionEnd!

    let newText = ""
    currentInput.focus()
    if (selectedText) {
        newText = inputText.substring(0, selectionStart) + "{{img:" + selectedText + "}}" + inputText.substring(selectionEnd)
    } else {
        newText = inputText.substring(0, selectionStart) + "{{img:}}" + inputText.substring(selectionEnd)
        setTimeout(() => currentInput.setSelectionRange(selectionStart + 6, selectionStart + 6), 10)
    }

    currentInput.value = newText
}

export function insertHeader(type: number) {
    if (type < 1 || type > 6) throw new Error("Header type must be between 1 and 6")

    const currentInput = getLastActiveTextArea()
    if (!currentInput) return
    const selectedText = window.lastTextSelection

    const inputText = currentInput.value
    const selectionStart = currentInput.selectionStart!
    const selectionEnd = currentInput.selectionEnd!

    let newText = ""
    currentInput.focus()
    if (selectedText) {
        newText = inputText.substring(0, selectionStart) + "" + "#".repeat(type) + " " + selectedText + inputText.substring(selectionEnd) + "\n"
    } else {
        newText = inputText.substring(0, selectionStart) + "" + "#".repeat(type) + " " + inputText.substring(selectionEnd) + "\n"
        setTimeout(() => currentInput.setSelectionRange(selectionStart + type + 1, selectionStart + type + 1), 10)
    }

    currentInput.value = newText
}

export function insertFormatting(format: "**" | "*" | "$" | "`" | "image") {

    const currentInput = getLastActiveTextArea()

    if (!currentInput) return
    const selectedText = window.lastTextSelection

    const inputText = currentInput.value
    const selectionStart = currentInput.selectionStart!
    const selectionEnd = currentInput.selectionEnd!

    let newText = ""


    currentInput.focus()
    if (selectedText) {

        newText = inputText.substring(0, selectionStart) + format + selectedText + format + inputText.substring(selectionEnd)
    } else {
        newText = inputText.substring(0, selectionStart) + format + format + inputText.substring(selectionEnd)
        //place cursor between the two formatting characters
        setTimeout(() => currentInput.setSelectionRange(selectionStart + format.length, selectionStart + format.length), 10)
    }

    currentInput.value = newText
}

export function insertFormattingActiveTextArea(format: "**" | "*" | "$" | "`" | "image") {

    const currentInput = document.activeElement as HTMLTextAreaElement

    if (!currentInput || currentInput.tagName !== "TEXTAREA") return

    if (!currentInput) return
    const selectedText = currentInput.value.substring(currentInput.selectionStart, currentInput.selectionEnd)

    const inputText = currentInput.value
    const selectionStart = currentInput.selectionStart!
    const selectionEnd = currentInput.selectionEnd!

    let newText = ""
    currentInput.focus()
    if (selectedText) {
        newText = inputText.substring(0, selectionStart) + format + selectedText + format + inputText.substring(selectionEnd)
    } else {
        newText = inputText.substring(0, selectionStart) + format + format + inputText.substring(selectionEnd)
        //place cursor between the two formatting characters
        setTimeout(() => currentInput.setSelectionRange(selectionStart + format.length, selectionStart + format.length), 10)

    }

    currentInput.value = newText
}

