
const projectConfig = require('../src/um-e2e-tests/config/project.config.json');
const fs = require('fs');
const xlsx = require("xlsx");
let parms = process.argv.splice(/);
let env = parms.length > 2 ? parms[2].trim().toLowerCase() : "test";
const finalResultsFile = `${process.cwd()}/test-results-e2e/finalResults/runtimeFinaleResults_${env}.json`;

function getFileNamesFromDir(dirPath: string) {
	let array: string[] = [];

	if (fs.readdirSync(dirPath).length !== 0) {
		fs.readdirSync(dirPath).forEach((fileName: string) => {
			array.push(fileName);
		})
	}
	return array;
}

function createFolder(folder: string) {
	let fs = require("fs");
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder, { recursive: true });
	}
}

function copyRunTimeDataFileMyTaskScenariosData(runtimeDataFile) {
	let runTimeData = JSON.parse(fs.readFileSync(runtimeDataFile));
	let finalResultsFileData = JSON.parse(fs.readFileSync(finalResultsFile));

	if (runTimeData.testData) {
		runTimeData.testData.forEach((scenarioData) => {
			finalResultsFileData.testData.push(scenarioData);
		})
		if (runTimeData.results) {
			finalResultsFileData.results.push(runTimeData.results);
		}
		fs.writeFileSync(finalResultsFile, JSON.stringify(finalResultsFileData, null, 2), 'utf-8');
	}

}

function createUpdateData() {
	createFolder(`${process.cwd()}/test-results-e2e/finalResults`);
	const files = getFileNamesFromDir(process.cwd() + projectConfig.RUN_TIME_DATA_PATH);

	if (files.length !== 0) {
		fs.writeFileSync(finalResultsFile, '{ "testData": [],"results":[]}', { flag: 'w' }, 'utf-8');
		files.forEach((file) => {
			const sFile = `${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}/${file}`;
			copyRunTimeDataFileMyTaskScenariosData(sFile);
		})



		// if (suite.toLowerCase() === 'auths' || suite.toLowerCase() === 'facility-validation') {
		let filename = `${process.cwd()}/test-results-e2e/finalResults/runtimeResults.xlsx`;
		let wb1 = xlsx.readFile(`${process.cwd()}/src/um-e2e-tests/testdata/sample.xlsx`);
		xlsx.writeFile(wb1, filename);
		//  suite.toLowerCase() === 'auths' ? authsAndFacilityDataFilePath + projectConfig.AUTHS_DATA_FILE : authsAndFacilityDataFilePath + projectConfig.FACILITY_VALIDATION_DATA_FILE;
		const sfile = require(finalResultsFile)
		let wb = xlsx.readFile(filename)
		const ws = xlsx.utils.json_to_sheet(sfile.results);
		xlsx.utils.book_append_sheet(wb, ws, "results" + new Date().toDateString() + new Date().getMilliseconds());
		xlsx.writeFile(wb, filename);
		console.log('Runtime results successfully uploaded path = ' + filename);

		// }

	}
}

createUpdateData();
