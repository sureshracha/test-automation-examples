
import * as util from '../utils/gen-lib';
const projectConfig = require('../config/project.config.json');
let txnTestDataFilePath = `${process.cwd()}/${projectConfig.TEST_DATA_TXN_PATH}`;
let txnTestDataFile = `${txnTestDataFilePath}/${projectConfig.TEST_TXN_DATA_FILE_NAME}`;

util.readExcelSheetsAndWriteToJsons(txnTestDataFile, txnTestDataFilePath);
