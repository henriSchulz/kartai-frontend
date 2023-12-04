export interface CSVParseResult {
    table: string[][]
    addedRows: number,
    failedRows: number
}


export class CSVParser {
    //before splitting the row, 'Tab' is replaced with \t

    public static readonly COMMON_DELIMITERS = ["\t", ",", ";", "|"]

    private readonly csv: string
    private readonly rows: string[]


    constructor(csv: string) {
        this.csv = csv
        this.rows = csv.split("\n")

    }


    private countChar(input: string, char: string) {
        return input.length - input.replaceAll(char, '').length
    }

    private findMaxValueKey(charOccurrences: Record<string, number>): string {
        let maxKey: string = "";
        let maxValue: number = -Infinity;

        for (const key in charOccurrences) {
            if (charOccurrences.hasOwnProperty(key)) {
                const value = charOccurrences[key];
                if (value > maxValue) {
                    maxKey = key;
                    maxValue = value;
                }
            }
        }

        return maxKey
    }


    private findMostCommonRowCount(rowCounts: number[]): number {
        if (rowCounts.length === 0) return 0

        var modeMap: any = {};
        var maxEl = rowCounts[0], maxCount = 1;
        for (var i = 0; i < rowCounts.length; i++) {
            var el = rowCounts[i];
            if (modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;
            if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }

    public predictRowCount(delimiter: string): number {
        const rowCounts: number[] = []

        for (const row of this.rows) {
            rowCounts.push(row.split(delimiter).length)
        }
        return this.findMostCommonRowCount(rowCounts)
    }

    public predictDelimiter(): string {
        const charOccurrences: Record<string, number> = {}
        for (const row of this.rows) {
            for (const d of CSVParser.COMMON_DELIMITERS) {
                const c = charOccurrences[d]
                const cO = this.countChar(row, d)
                charOccurrences[d] = c ? c + cO : cO
            }
        }
        return this.findMaxValueKey(charOccurrences)
    }


    public parse(csvDelimiter: string = this.predictDelimiter()): CSVParseResult | null {
        if (this.rows.length === 0) return null

        const table: string[][] = []

        const rowCount = this.predictRowCount(csvDelimiter)

        for (const row of this.rows) {
            const rowValues = row.split(csvDelimiter)
            if (rowValues.length === rowCount) {
                table.push(rowValues)
            }
        }

        return {
            table,
            addedRows: table.length,
            failedRows: this.rows.length - table.length
        }
    }
}