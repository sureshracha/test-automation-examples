const reporter = require('cucumber-html-reporter');
let parms = process.argv;
const envName = parms.length > 2 ? parms[2].trim().toLowerCase() : "test";
const tag = parms.length > 3 ? parms[3].trim() : "smoke";
const tool = parms.length > 4 ? parms[4].trim().toLowerCase() : "cypress";
const browser = parms.length > 5 ? (parms[4].trim().toLowerCase() == 'cypress' ? "Electron" : parms[5].trim().toLowerCase()) : "chrome";

const os = require('os');

const jsondir = `${process.cwd()}/test-results/`;
const outputfile = `${process.cwd()}/test-results/${envName}-${tag}-index.html`;
const options = {
	theme: 'bootstrap',
	jsonDir: jsondir,
	output: outputfile,
	reportSuiteAsScenarios: true,
	scenarioTimestamp: true,
	launchReport: true,
	ignoreBadJsonFile: true,

	metadata: {
		"Test Environment": `${envName.toUpperCase()}`,
		"suite ": `${tag.toUpperCase()}`,
		"Browser": `${browser.toUpperCase()}`,
		"Platform": `${os.hostname()}`,
		"Tool": `${tool.toUpperCase()}`,
		"Generated Date & Time": `${new Date()}`
	}
}

const fs = require('fs')
if (fs.readdirSync(process.cwd() + '/test-results').length !== 0) {
	reporter.generate(options);
} else {
	console.log('test-results -  folder is empty')
}
