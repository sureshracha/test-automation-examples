const { readdirSync, statSync, writeFileSync, fs } = require('fs');
const util = require('./general.util');

let parms = process.argv.splice(' ');
const envName = parms.length > 2 ? parms[2].trim().toLowerCase() : "stage-um";
const tag = parms.length > 3 ? parms[3].trim() : "smoke";
let browser = parms.length > 4 ? parms[4].trim().toLowerCase() : "chrome";
let parallel = parms.length > 5 ? parms[5].trim().toLowerCase() : "1";
let customSRN = parms.length > 6 ? parms[6].trim() : null;
let closeCustomSRN = parms.length > 7 ? parms[7].trim() : null;

const packageJsonOputfile = `${process.cwd()}/package.json`;
const cucumberJsonOutputfile = `${process.cwd()}/cucumber.json`;
const projectConfigFile = `${process.cwd()}/src/um-e2e-tests/config/project.config.json`;
const cucumberJsonData = require(cucumberJsonOutputfile);
const packageJsonData = require(packageJsonOputfile);
const prjectConfigData = require(projectConfigFile);

cucumberJsonData.default.parallel = Number(parallel);
cucumberJsonData.rerun.parallel = Number(parallel);
packageJsonData.scripts.cleanreport = `node automationUtils/init-report-e2e.js`;
packageJsonData.scripts.report = `node automationUtils/e2e-report.js ${envName} ${tag} ${browser}`;
prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE = [];
delete packageJsonData.scripts.pretest;

let expectedTags = ['facility-validation', 'auths', 'dummy', 'data-gen', 'casesync', 'stargate-api', 'closesrnorhsc'];
// packageJsonData.scripts.pretest = "rm -rf ./path/to/test-data-dir/* || true";

if (customSRN !== null) {
    packageJsonData.scripts.test = `cross-env ENV=${envName} BROWSER=${browser} TAG=@${tag} CUSTOMSRN=${customSRN} CLOSECUSTOMSRN=${closeCustomSRN} cucumber-js`;
} else {
    packageJsonData.scripts.test = `cross-env ENV=${envName} BROWSER=${browser} TAG=@${tag} cucumber-js`;
}

if (tag.includes('.feature') || tag.includes(' - ') || tag.match('[a-zA-Z]+[0-9]+') != null || tag.includes(",")) {
    let filteredFiles = util.getFilteredFeatureFiles(tag);
    delete cucumberJsonData.default.tags;
    cucumberJsonData.default.paths = filteredFiles;
    prjectConfigData.TEST_TXN_DATA_FILE_NAME = "OCM_UM_E2E_DATA_v1.0.xlsx";
} else {
    cucumberJsonData.default.paths = [`src/um-e2e-tests/features/**/*`];
    if (expectedTags.indexOf(tag) < 0) {

        let nofScenarios = prjectConfigData.MAX_NO_OF_SCENARIOS;
        let sTags;
        // if (tag === 'letters') {
        //     sTags = `@${tag}-srncreate or @${tag}-1`;
        // } else {
        sTags = `@${tag}-srncopy or @${tag}-1`;
        // }
        // if (tag === 'letters') {
        //     prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE.push(`@${tag}-srncreate`);
        // } else {
        prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE.push(`@${tag}-srncopy`);
        // }
        prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE.push(`@${tag}-1`);
        for (let i = 2; i <= Number(nofScenarios); i++) {
            sTags = `${sTags} or @${tag}-${i}`;
            prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE.push(`@${tag}-${i}`);
        }
        cucumberJsonData.default.tags = `${sTags} or @${tag}-srnclose`;
        prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE.push(`@${tag}-srnclose`);
        prjectConfigData.TEST_TXN_DATA_FILE_NAME = "OCM_UM_E2E_DATA_v1.0.xlsx";
        // @letters_test is the tag name to execute the CnS letters scenarios requested by UAT
        if (tag === 'letters_test') {
            prjectConfigData.TEST_TXN_DATA_FILE_NAME = "Letters_Req_Testdata.xlsx";
        }
        if (tag.includes('gwat')) {
            prjectConfigData.TEST_TXN_DATA_FILE_NAME = "GWAT_Testdata.xlsx";
        }
    } else {
        prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE.push(`@${tag}`);
        cucumberJsonData.default.tags = `@${tag}`;
        if (tag === 'auths') {
            // delete cucumberJsonData.default.tags;
            packageJsonData.scripts.authscreation = `cross-env ENV=${envName} BROWSER=${browser} TAG=@${tag} cucumber-js --tags @auths`;
            prjectConfigData.SCENARIOS_EXECUTION_SEQUENCE.push(`@assignedusers`);
        }
        packageJsonData.scripts.exportresults = `node automationUtils/copy-runtimedata-to-results.js ${tag} ${envName} `;
    }
}

// prjectConfigData.ON_FAILURE_SCREENSHOT = tag.toLowerCase().includes('smoke') ? true : false;
packageJsonData.scripts.getAssignedUsers = `cross-env ENV=${envName} BROWSER=${browser} TAG=@${tag} cucumber-js --tags @assignedusers`;
packageJsonData.scripts["test:failed"] = `cross-env ENV=${envName} BROWSER=${browser} TAG=@${tag} cucumber-js -p rerun @rerun.txt`;
writeFileSync(packageJsonOputfile, JSON.stringify(packageJsonData, null, 2));
writeFileSync(cucumberJsonOutputfile, JSON.stringify(cucumberJsonData, null, 2));
writeFileSync(projectConfigFile, JSON.stringify(prjectConfigData, null, 2));
console.log('env-setup for playwright scripts is done successfully .....');

