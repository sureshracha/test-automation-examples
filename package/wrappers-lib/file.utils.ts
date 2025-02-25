

export async function checkFolderAndCreate(folder: string) {
    let fs = require("fs");
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
}

export async function writeJsonData(filePath: string, data: any) {
    let fs = require("fs");
    await fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { flag: 'w' }, 'utf-8');
}

export async function readJsonData(filePath: string) {
    let fs = require("fs");
    return await JSON.parse(fs.readFileSync(filePath))
}

export async function readData(filePath: string) {
    let fs = require("fs");
    const data = await fs.readFileSync(filePath);
    return data;

}

export async function isfileExist(filepath: string) {
    let fs = require("fs");
    return fs.existsSync(filepath);
}



export async function getFileNamesFromDir(dirPath: string) {
    let fs = require("fs");
    let array = new Array();
    await fs.readdirSync(dirPath).forEach((fileName: string) => {
        array.push(fileName);
    })
    return array;
}

export async function getFullFileNames(dirPath: string, fileNameSubString: string) {
    let fs = require("fs");
    let array: string[] = []; // Initialize array as an empty array
    await fs.readdirSync(dirPath).forEach((fileName?: string) => {
        if (fileName?.includes(fileNameSubString)) {
            array?.push(fileName);
        }
    })
    return array;
}

export async function makeEmptyFolder(dirPath: string) {
    const fse = require("fs-extra");
    try {
        fse.ensureDir(dirPath);
        fse.emptyDir(dirPath);

    } catch (error) {
        console.log("Folder not created! " + error);
    }
}
