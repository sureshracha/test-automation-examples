
import { Before, After, Status, parallelCanAssignHelpers } from "@cucumber/cucumber"; // , setParallelCanAssign, parallelCanAssignHelpers

import { request } from "@playwright/test";
import { getEnv } from '../helpers/env/env';
import { createLogger } from "winston";
import { playwrightWrapper, invokeBrowser, closeplaywright } from '@qe-solutions/playwright-test-wrappers';
import { customLogger, fileUtils, tcontext, runtimeDataUtils } from '@qe-solutions/test-automation-library';

import TestDataUtils from '../utils/testData.utils';
const projectConfig = require('../config/project.config.json');
const { atMostOnePicklePerTag } = parallelCanAssignHelpers;
const myTagRule = atMostOnePicklePerTag([projectConfig.SCENARIOS_EXECUTION_SEQUENCE]);

const userCredentials = require('../testdata/ref/loginDetails.json');
// Only one pickle with @tag1 can run at a time
//   AND only one pickle with @tag2 can run at a time
//setParallelCanAssign(myTagRule);

const testDataUtils = new TestDataUtils();

Before(async function ({ pickle }) {
    await getEnv();
    let appUserId = '';
    let appPwd = '';
    let txnDatafolder = `${process.cwd()}${projectConfig.RUN_TIME_DATA_PATH}`;

    playwrightWrapper.browser = await invokeBrowser(process.env.BROWSER, { headless: false });

    console.log('worker id : ' + process.env.CUCUMBER_WORKER_ID + ' ### pickle Name : ' + pickle.name);

    console.log(process.env.BROWSER)
    playwrightWrapper.context = await playwrightWrapper.browser.newContext(
        {
            // recordVideo: {
            //     dir: "test-results/videos",
            // },
            viewport: { 'width': 1850, 'height': 950 },
            httpCredentials:
            {
                username: appUserId,
                password: appPwd
            }
        }
    );


    // awaitplaywrightWrapper.context.tracing.start({
    //     name: pickle.name,
    //     title: pickle.name,
    //     sources: true,
    //     snapshots: true
    // });

    playwrightWrapper.page = await playwrightWrapper.context.newPage();
    tcontext.testContext.assertsJson = JSON.parse("{}");
    tcontext.testContext.assertsJson.soft = [];
    tcontext.testContext.runtimeStorageFile = await runtimeDataUtils.createRunTimeDataJsonFile(txnDatafolder, "test", pickle);
    let scn = await runtimeDataUtils.getRunTimeScnearioNo(pickle);
    let sourceFile = await testDataUtils.getSourceTestDataFile();
    let sourceDirectory = `${process.cwd()}${projectConfig.TEST_DATA_TXN_PATH}`;

    await runtimeDataUtils.copyScenariosDataToRunTimeDataFile(sourceDirectory, sourceFile, scn);
    // await testDataUtils.renameKey(tcontext.testContext.runtimeStorageFile, 'MyTasks', 'testData');
    let loggerFileName = await runtimeDataUtils.getRunTimeDataFileName(pickle) + "-" + pickle.id;
    tcontext.testContext.logger = createLogger(await customLogger.options({ fileName: loggerFileName, logfileFolder: `${process.cwd()}/test-results-e2e/logs` }));
    tcontext.testContext.runtimeLoggerFile = `${process.cwd()}/test-results/logs/${loggerFileName}.log`;
    playwrightWrapper.apiContext = await request.newContext({
        baseURL: process.env.APIURL,
    });

    console.log(' Worker id : ' + process.env.CUCUMBER_WORKER_ID);
    console.log(' User id picked : ' + appUserId);
    await runtimeDataUtils.addOrUpdateRunTimeResultsData('ScenarioNo', scn);
    customLogger.info(' Worker id : ' + process.env.CUCUMBER_WORKER_ID);
    customLogger.info(' User id picked : ' + appUserId);
});

After(async function ({ pickle, result }) {

    await afterSceanrio(pickle, result, this);
    await closeplaywright();

    await playwrightWrapper.context.close();
    if (playwrightWrapper.apiContext) await playwrightWrapper.apiContext.dispose();
    if (playwrightWrapper.browser) await playwrightWrapper.browser.close();
    if (tcontext.testContext.logger)
        tcontext.testContext.logger.close();
});



async function afterSceanrio(pickle: any, result: any, worldObj: any) {
    let filedata = await fileUtils.readData(tcontext.testContext.runtimeLoggerFile);
    await attachlog(
        filedata + result.duration, worldObj
    );

    let runtimeData = await fileUtils.readData(tcontext.testContext.runtimeStorageFile);
    await attachlog(runtimeData, worldObj);
    await fileUtils.checkFolderAndCreate(`${process.cwd()}/test-results/screenshots`);

    if (result?.status === Status.FAILED) {
        await attachImage(result, pickle, worldObj);
    }

    if (tcontext.testContext.assertsJson) {
        if (tcontext.testContext.assertsJson.soft.length > 0) {
            await attachlog(JSON.stringify(tcontext.testContext.assertsJson, null, 2), worldObj);
            if (result?.status !== Status.FAILED) {
                await attachImage(result, pickle, worldObj);
                await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', 'FAIL');
            }
        }
    }

    async function attachlog(data: any, worldObj: any) {
        worldObj.attach(data, "text/plain");
    }

    async function attachImage(result: any, pickle: any, worldObj: any) {
        if (result?.status === Status.FAILED) {
            await runtimeDataUtils.addOrUpdateRunTimeResultsData('Results', 'FAIL');

            let img: Buffer;
            img = await playwrightWrapper.page.screenshot({ path: `${process.cwd()}/test-results/screenshots/${await runtimeDataUtils.getRunTimeScnearioNo(pickle) + "-" + pickle.id}.png`, type: "png", fullPage: true });

            worldObj.attach(
                img, "image/png"
            )

        }
    }
}
