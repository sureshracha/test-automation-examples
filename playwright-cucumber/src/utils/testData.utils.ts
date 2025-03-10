import { fileUtils, tcontext } from "@qe-solutions/test-automation-library";
export default class TestDataUtils {
    getSourceTestDataFile() {
        return 'sourceTestData.json';
    }

    async renameKey(runtimeStorageFile: string, oldKey: string, newKey: string) {
        let jsonData = await fileUtils.readJsonData(runtimeStorageFile);
        jsonData[newKey] = jsonData[oldKey];
        delete jsonData[oldKey];
        await fileUtils.writeJsonData(runtimeStorageFile, jsonData);
    }
}