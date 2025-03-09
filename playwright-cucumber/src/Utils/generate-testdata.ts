const projectConfig = require('../src/um-e2e-tests/config/project.config.json');
const util = require('./general.util');
let txnTestDataFilePath = `${process.cwd()}/${projectConfig.TEST_DATA_TXN_PATH}`;
let txnTestDataFile = `${txnTestDataFilePath}/${projectConfig.TEST_TXN_DATA_FILE_NAME}`;

util.readExcelSheetsAndWriteToJsons(txnTestDataFile, txnTestDataFilePath);
