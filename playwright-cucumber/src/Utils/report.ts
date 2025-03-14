import reporter from 'cucumber-html-reporter';
import os from 'os';
import fs from 'fs';

let args = process.argv;
const environmentName = args.length > 2 ? args[2].trim().toLowerCase() : "test";
const testTag = args.length > 3 ? args[3].trim() : "smoke";
const tool = args.length > 4 ? args[4].trim().toLowerCase() : "Playwright";
const browserType = args.length > 5 ? args[5].trim().toLowerCase() : "chrome";

const jsondir = `${process.cwd()}/test-results/`;
const outputfile = `${process.cwd()}/test-results/${environmentName}-${testTag}-index.html`;
const options = {
	theme: "bootstrap" as "bootstrap",
	jsonDir: jsondir,
	output: outputfile,
	reportSuiteAsScenarios: true,
	scenarioTimestamp: true,
	launchReport: true,
	ignoreBadJsonFile: true,

	metadata: {
		"Test Environment": `${environmentName.toUpperCase()}`,
		"suite ": `${testTag.toUpperCase()}`,
		"Browser": `${browserType.toUpperCase()}`,
		"Platform": `${os.hostname()}`,
		"Tool": `${tool.toUpperCase()}`,
		"Generated Date & Time": `${new Date()}`
	}
}

if (fs.readdirSync(process.cwd() + '/test-results').length !== 0) {
	reporter.generate(options);
} else {
	console.log('test-results -  folder is empty');
}
