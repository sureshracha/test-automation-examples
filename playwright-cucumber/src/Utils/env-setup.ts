import * as  fs from 'fs';
import * as util from './gen-lib';

let args = process.argv.splice(2);
const envName = args.length > 0 ? args[0].trim().toLowerCase() : "test";
const tag = args.length > 1 ? args[1].trim() : "smoke";
let browser = args.length > 2 ? args[2].trim().toLowerCase() : "chrome";
let parallel = args.length > 3 ? args[3].trim().toLowerCase() : "1";

const packageJsonOputfile = `${process.cwd()}/package.json`;
const cucumberJsonOutputfile = `${process.cwd()}/cucumber.json`;
const projectConfigFile = `${process.cwd()}/src/config/project.config.json`;
const cucumberJsonData = require(cucumberJsonOutputfile);
const packageJsonData = require(packageJsonOputfile);
const prjectConfigData = require(projectConfigFile);

cucumberJsonData.default.parallel = Number(parallel);
cucumberJsonData.rerun.parallel = Number(parallel);
packageJsonData.scripts.cleanreport = `node automationUtils/init-report-e2e.js`;
packageJsonData.scripts.report = `node automationUtils/e2e-report.js ${envName} ${tag} ${browser}`;
prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE = [];
delete packageJsonData.scripts.pretest;

let expectedTags = [' @smoke', ' @regression', ' @sanity'];


if (tag.includes('.feature') || tag.includes(' - ') || tag.match('[a-zA-Z]+[0-9]+') != null || tag.includes(",")) {
    let filteredFiles = util.getFilteredFeatureFiles(tag);
    delete cucumberJsonData.default.tags;
    cucumberJsonData.default.paths = filteredFiles;
    prjectConfigData.TEST_TXN_DATA_FILE_NAME = "testData.xlsx";
} else {
    cucumberJsonData.default.paths = [`playright-cucumber/src/features/**/*`];

    prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE.push(`@${tag}`);
    cucumberJsonData.default.tags = `@${tag}`;
    packageJsonData.scripts.test = `cross-env ENV=${envName} BROWSER=${browser} TAG=@${tag} cucumber-js`;
    packageJsonData.scripts.exportresults = `npx ts-node src/utils/consolidate-testresults.js ${tag} ${envName} `;

}

// prjectConfigData.ON_FAILURE_SCREENSHOT = tag.toLowerCase().includes('smoke') ? true : false;
packageJsonData.scripts["test:failed"] = `cross-env ENV=${envName} BROWSER=${browser} TAG=@${tag} cucumber-js -p rerun @rerun.txt`;
fs.writeFileSync(packageJsonOputfile, JSON.stringify(packageJsonData, null, 2));
fs.writeFileSync(cucumberJsonOutputfile, JSON.stringify(cucumberJsonData, null, 2));
fs.writeFileSync(projectConfigFile, JSON.stringify(prjectConfigData, null, 2));
console.log('env-setup for playwright scripts is done successfully .....');

