
import { BeforeAll, AfterAll, Before, After, Status, setParallelCanAssign, parallelCanAssignHelpers, setDefaultTimeout } from "@cucumber/cucumber"; // , setParallelCanAssign, parallelCanAssignHelpers

import { request } from "@playwright/test";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import runtimeDataUtils from '../utils/common/runtime-data.utils';
import TestDataUtils from "../utils/common/testdata.utils";
import { playwright, invokeBrowser, closeplaywright } from '@qe-solutions/playwright-test-wrappers';
import { customLogger, fileUtils, tcontext, customAssert } from '@qe-solutions/test-automation-library';
import * as projectConfig from '../config/project.config.json';
import * as userCredentials from '../testdata/cwfm/ref/userCredentials.json';

const { atMostOnePicklePerTag } = parallelCanAssignHelpers;
const myTagRule = atMostOnePicklePerTag(projectConfig.SCENARIOS_EXECUTION_SEQUENCE);

// Only one pickle with @tag1 can run at a time
//   AND only one pickle with @tag2 can run at a time
//setParallelCanAssign(myTagRule);

const testDataUtils = new TestDataUtils();

Before(async function ({ pickle }) {
    await getEnv();
    let appUserId = '';
    let appPwd = '';
    let txnDatafolder = `${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}`;

    playwright.browser = await invokeBrowser(process.env.BROWSER, { headless: true });

    console.log('worker id : ' + process.env.CUCUMBER_WORKER_ID + ' ### pickle Name : ' + pickle.name);
    let CryptoJS = require('crypto-js');
    if (projectConfig.SERVICE_ACCOUNT.toLowerCase().trim() === 'yes') {
        const loginDetails = userCredentials.serviceAccounts[process.env.CUCUMBER_WORKER_ID];
        appUserId = loginDetails.userName;
        appPwd = CryptoJS.enc.Base64.parse(userCredentials.encryptedPwd).toString(CryptoJS.enc.Utf8);

    } else {
        let userData = await testDataUtils.getLoginJsonData();
        appUserId = userData.msid;
        appPwd = userData.encryptedPwd;
    }

    playwright.context = await playwright.browser.newContext(
        {
            // recordVideo: {
            //     dir: "test-results/videos",
            // },
            viewport: { 'width': 1850, 'height': 950 },
            httpCredentials:
            {
                username: appUserId,
                password: appUserId
            }
        }
    );
    if (process.env.TAG.includes('facility-validation')) {
        // projectConfig.DEFAULT_WAIT_TIME = 560000
        // projectConfig.PAGE_LOAD_TIMEOUT = 560000
        setDefaultTimeout(560000);
        playwright.context.setDefaultNavigationTimeout(560000);
    }

    // await playwright.context.tracing.start({
    //     name: pickle.name,
    //     title: pickle.name,
    //     sources: true,
    //     snapshots: true
    // });

    playwright.page = await playwright.context.newPage();
    tcontext.testContext.assertsJson = JSON.parse("{}");
    tcontext.testContext.assertsJson.soft = [];
    tcontext.testContext.runtimeStorageFile = await runtimeDataUtils.createRunTimeDataJsonFile(txnDatafolder, process.env.ENV, pickle);
    let scn = await runtimeDataUtils.getRunTimeScnearioNo(pickle);
    let sourceFile = await testDataUtils.getSourceTestDataFile();
    let sourceDirectory = `${process.cwd()}${projectConfig.TEST_DATA_TXN_PATH}`;

    await runtimeDataUtils.copyScenariosDataToRunTimeDataFile(sourceDirectory, sourceFile, scn);
    await testDataUtils.renameKey(tcontext.testContext.runtimeStorageFile, 'MyTasks', 'testData');
    let loggerFileName = await runtimeDataUtils.getRunTimeDataFileName(pickle) + "-" + pickle.id;
    tcontext.testContext.logger = createLogger(await customLogger.options({ fileName: loggerFileName, logfileFolder: `${process.cwd()}/test-results-e2e/logs` }));
    tcontext.testContext.runtimeLoggerFile = `${process.cwd()}/test-results-e2e/logs/${loggerFileName}.log`;
    playwright.apiContext = await request.newContext({
        baseURL: process.env.APIURL,
    });

    console.log(' Worker id : ' + process.env.CUCUMBER_WORKER_ID);
    console.log(' User id picked : ' + appUserId);
    await runtimeDataUtils.addOrUpdateRunTimeResultsData('ScenarioNo', scn);
    customLogger.info(' Worker id : ' + process.env.CUCUMBER_WORKER_ID);
    customLogger.info(' User id picked : ' + appUserId);
    if (process.env.CUSTOMSRN !== 'null' && process.env.CUSTOMSRN !== undefined && process.env.CUSTOMSRN !== null) {
        let closeCustomSRNs = [];
        let customsrns = process.env.CUSTOMSRN.split("/");
        if (process.env.CLOSECUSTOMSRN !== null) {
            closeCustomSRNs = process.env.CLOSECUSTOMSRN.split("/");
        } else {
            closeCustomSRNs = Array(customsrns.length).fill('No');
        }
        for (let lpIndex = 0; lpIndex < customsrns.length; lpIndex++) {
            await runtimeDataUtils.setRunTimeTestData("UseExistingSRN", customsrns[lpIndex].trim(), lpIndex);
            await runtimeDataUtils.setRunTimeTestData("CloseSRN", closeCustomSRNs[lpIndex].trim(), lpIndex);
        }
    }
    let runtimeData = runtimeDataUtils.getRunTimeResultsData('nextScenarioToExecute');
    if (runtimeData !== undefined || runtimeData !== null) {
        await runtimeDataUtils.addOrUpdateRunTimeResultsData('nextScenarioToExecute', true);
    }
});

After(async function ({ pickle, result }) {
    // const path = `./test-results-e2e/trace/${pickle.id}.zip`;
    await afterSceanrio(pickle, result, this);
    await closeplaywright();
    // await playwright.context.tracing.stop({ path: path });
    await playwright.context.close();
    if (playwright.apiContext) await playwright.apiContext.dispose();
    if (playwright.browser) await playwright.browser.close();
    if (tcontext.testContext.logger)
        tcontext.testContext.logger.close();
});



async function afterSceanrio(pickle: any, result: any, worldObj: any) {
    // if (!process.env.TAG.includes('auths') && !process.env.TAG.includes('assignedusers')) {
    let filedata = await fileUtils.readData(tcontext.testContext.runtimeLoggerFile);
    await attachlog(
        filedata + result.duration, worldObj
    );

    let runtimeData = await fileUtils.readData(tcontext.testContext.runtimeStorageFile);
    await attachlog(runtimeData, worldObj);
    await fileUtils.checkFolderAndCreate(`${process.cwd()}/test-results-e2e/screenshots`);

    if (result?.status === Status.FAILED) {
        await attachImage(result, pickle, worldObj);
        await runtimeDataUtils.addOrUpdateRunTimeResultsData('nextScenarioToExecute', false);
    }


    if (tcontext.testContext.assertsJson) {
        if (tcontext.testContext.assertsJson.soft.length > 0) {
            //await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', `${JSON.stringify(tcontext.testContext.assertsJson.soft, null, 2)}`);
            await attachlog(JSON.stringify(tcontext.testContext.assertsJson, null, 2), worldObj);
            if (result?.status !== Status.FAILED) {
                await attachImage(result, pickle, worldObj);
                if (process.env.TAG.includes('facility-validation')) {
                    await customAssert.hardAssert(true, false, `Soft Asserts Failed: ${JSON.stringify(tcontext.testContext.assertsJson.soft, null, 2)}`);
                }
                await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', 'FAIL');
            }
        }
    }

    // }
    async function attachlog(data: any, worldObj: any) {
        worldObj.attach(data, "text/plain");
    }

    async function attachImage(result: any, pickle: any, worldObj: any) {
        if (result?.status === Status.FAILED) {
            await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', 'FAIL');
            // let flag = process.env.TAG.includes('auths') || process.env.TAG.includes('facility-validation') ? true : projectConfig.ON_FAILURE_SCREENSHOT;
            // if (flag) {
            let img: Buffer;
            img = await playwright.page.screenshot({ path: `${process.cwd()}/test-results-e2e/screenshots/${await runtimeDataUtils.getRunTimeScnearioNo(pickle) + "-" + pickle.id}.png`, type: "png", fullPage: true });

            worldObj.attach(
                img, "image/png"
            )
            // }
        } else {
            if (!process.env.TAG.includes('stargate-api') || !process.env.TAG.includes('facility-validation')) {
                await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', `PASS`);
            }
        }
    }
}
