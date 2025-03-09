const xlsx = require("xlsx");
const fs = require('fs');

Date.prototype.mmddyyyy = function () {
    const yyyy = this.getFullYear().toString();
    const mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based         
    const dd = (this.getDate()).toString();
    return (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]) + '/' + yyyy;
}

function readExcelSheetsAndWriteToJsons(excelFilePath, jsonFilePath) {
    let tempFilePath = `${jsonFilePath}/temp.xlsx`;
    let wb = xlsx.readFile(excelFilePath, {
        cellDates: true,
        //cellNF: 'mm/dd/yyyy;@'  
    })
    let XLSX_CALC = require('xlsx-calc');
    XLSX_CALC(wb);
    xlsx.writeFile(wb, tempFilePath);
    console.log("Excel Path : " + excelFilePath);
    wb = xlsx.readFile(tempFilePath, {
        type: 'buffer',
        cellDates: true,
        blankrows: false, header: false, defval: null, raw: false, dateNF: 'dd-mm-yyyy'

    })

    writeToJsonFile(wb, jsonFilePath);
    console.log("Testdata generated successfully at " + jsonFilePath);
    fs.unlink(tempFilePath, (err) => {
        if (err) throw err;
    })
}

function writeToJsonFile(workBook, pathToWrite) {

    const sheetNames = workBook.SheetNames;
    for (const sheetName of sheetNames) {
        const ws = workBook.Sheets[sheetName];
        let data = xlsx.utils.sheet_to_json(ws, { blankrows: false, header: false, defval: null, raw: false, dateNF: 'dd-mm-yyyy' });
        data.forEach((d) => {
            Object.keys(d).forEach(key => {
                if (d[key]) {
                    if (d[key].toString().includes(`'`)) {
                        d[key] = d[key].toString().split(`'`)[1];
                    }
                    d[key] = d[key].toString().trim();
                }
            })
        })
        fs.existsSync(`${pathToWrite}/${sheetName}.json`);
        fs.writeFileSync(`${pathToWrite}/${sheetName}.json`, `{\n "testData" : ${JSON.stringify(data, null, 2)} \n}`, 'utf-8');
    }
}

function getAllFilesIncludingSubFolders(dir) {
    let fs = require("fs");
    return fs.readdirSync(dir).flatMap((item) => {
        const path = `${dir}/${item}`;
        if (fs.statSync(path).isDirectory()) {
            return getAllFilesIncludingSubFolders(path);
        }
        return path;
    });
}

function getFilteredFeatureFiles(tag) {
    let featuresPath = `${process.cwd()}/src/um-e2e-tests/features/cwfm`;
    let allFiles = this.getAllFilesIncludingSubFolders(featuresPath);
    //convert all provided tag names to an array
    let allScenarioNumbers = tag.split(",");
    let filteredFiles = [];
    allScenarioNumbers.forEach(function (scenarioNum) {
        scenarioNum = scenarioNum.match('[a-zA-Z]+[0-9]+_*[a-zA-Z]*[0-9]*')[0].trim();
        allFiles.forEach(function (fileName) {
            if (fileName.includes(scenarioNum + " -")) {
                filteredFiles.push(fileName);
            }
        });
        if (filteredFiles.length === 0) {
            console.log(`No feature files found for the input : ${scenarioNum}`);
        }
    });

    filteredFiles = filteredFiles.filter(function (file) {
        return file !== undefined;
    });
    console.log(`Below Feature files matched for the input : ${tag}: \n ${filteredFiles}`);
    return filteredFiles;
}

module.exports = {
    readExcelSheetsAndWriteToJsons,
    getAllFilesIncludingSubFolders,
    getFilteredFeatureFiles
}
