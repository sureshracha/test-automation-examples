

export default class StringUtils {

    async convertAnyToString(val: any) {
        return val.toString();
    }

    async replaceAll(val: string, replaceChar: string) {
        if (val.constructor === String) {
            if (val.includes(replaceChar)) {
                return val.split(replaceChar).join('').toString();
            }
        }
        return val;
    }
    async getIndex(sourceArray: string[][], expectedValues: string[], exactMatch: boolean = false) {
        let row_index = sourceArray.findIndex((row_text) => {
            for (const col_data of expectedValues) {
                if (exactMatch) {
                    if (row_text.findIndex((ele: any) => ele.trim().toLowerCase() === col_data.toLowerCase().trim()) < 0) return false;
                }
                else {
                    if (row_text.findIndex((ele: any) => ele.trim().toLowerCase().includes(col_data.toLowerCase().trim())) < 0) return false;
                }
            }
            return true;
        });

        if (row_index >= 0) {
            return row_index;
        }
        return -1;
    }
    async toTitleCase(str: string) {
        let words = str.split(' ');
        let titleCase = '';
        for (const word of words) {
            titleCase += word[0].toUpperCase() + word.substr(1).toLowerCase() + ' ';
        }
        return titleCase.trim();
    }

    async toCamelCase(str: string) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }
}