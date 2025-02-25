import { expect } from "@playwright/test";
import testContext from "./testContext";
import logger from './logger';

class CustomAssert {

    async softAssert(actual: any, expected: any, message: string, caseSensitive: boolean = false) {
        if (typeof (actual) === 'string' && typeof (expected) === 'string') {
            actual = caseSensitive ? actual.trim() : actual.toLowerCase().trim();
            expected = caseSensitive ? expected.trim() : expected.toLowerCase().trim();
        }
        if (actual === expected) {
            await logger.info(`softAssert :: ${message} {Actual : [${actual}] - Expected [${expected}]}`);
        } else {
            await logger.error(`softAssert :: ${message} {Actual : [${actual}] - Expected [${expected}]}`);
            testContext.assertsJson.soft.push({ softAssert: "Failed", caseSensitive: `${caseSensitive}`, Actual: `${actual}`, Expected: `${expected}`, message: `${message}` });
        }
    }

    async softContains(actual: any, expected: any, message: string, caseSensitive: boolean = false) {
        if (typeof (actual) === 'string' && typeof (expected) === 'string') {
            actual = caseSensitive ? actual.trim() : actual.toLowerCase().trim();
            expected = caseSensitive ? expected.trim() : expected.toLowerCase().trim();
        }
        if (actual.includes(expected)) {
            await logger.info(`softContains :: ${message} {String : [${actual}] - Substring [${expected}]}`);
        } else {
            await logger.error(`softContains :: ${message} {String : [${actual}] - Substring [${expected}]}`);
            testContext.assertsJson.soft.push({ softContains: "Failed", caseSensitive: `${caseSensitive}`, Actual: `${actual}`, Expected: `${expected}`, message: `${message}` });
        }
    }

    async softNotContains(actual: any, expected: any, message: string, caseSensitive: boolean = false) {
        actual = caseSensitive ? actual.trim() : actual.toLowerCase().trim();
        expected = caseSensitive ? expected.trim() : expected.toLowerCase().trim();
        if (!actual.includes(expected)) {
            await logger.info(`softNotContains :: ${message} {String : [${actual}] - Substring [${expected}]}`);
        } else {
            await logger.error(`softNotContains :: ${message} {String : [${actual}] - Substring [${expected}]}`);
            testContext.assertsJson.soft.push({ softNotContains: "Failed", caseSensitive: `${caseSensitive}`, Actual: `${actual}`, Expected: `${expected}`, message: `${message}` });
        }
    }

    async softContainsForStringArray(actual: string[], expected: any, message: string, caseSensitive: boolean = false) {
        actual = caseSensitive ? actual : actual.toString().toLowerCase().split(',');
        expected = caseSensitive ? expected.trim() : expected.toLowerCase().trim();
        if (actual.indexOf(expected) >= 0) {
            await logger.info(`softContainsForStringArray :: ${message} {Array : [${actual}] - Element [${expected}]}`);
        } else {
            await logger.error(`softContainsForStringArray :: ${message} {Array : [${actual}] - Element [${expected}]}`);
            
            testContext.assertsJson.soft.push({ softContainsForStringArray: "Failed", caseSensitive: `${caseSensitive}`, Actual: `${actual}`, Expected: `${expected}`, message: `${message}` })
        }
    }
    async softNotContainsForStringArray(actual: string[], expected: any, message: string, caseSensitive: boolean = false) {
        actual = caseSensitive ? actual : actual.toString().toLowerCase().split(',');
        expected = caseSensitive ? expected.trim() : expected.toLowerCase().trim();
        if (actual.indexOf(expected) < 0) {
            await logger.info(`softNotContainsForStringArray :: ${message} {Array : [${actual}] - Element [${expected}]}`);
        } else {
            await logger.error(`softNotContainsForStringArray :: ${message} {Array : [${actual}] - Element [${expected}]}`);
            testContext.assertsJson.soft.push({ softContainsForStringArray: "Failed", caseSensitive: `${caseSensitive}`, Actual: `${actual}`, Expected: `${expected}`, message: `${message}` })
        }
    }

    async softAssertCompareStringArrays(actual: string[], expected: string[], message: string, caseSensitive: boolean = false) {
        let diffVals = actual.filter(item => expected.indexOf(item) < 0);
        let count = diffVals.length;
        let flag = (count === 0);
        if (flag) {
            await logger.info(`softAssertCompareArrays :: ${message} {Actual : [${actual}] - Expected  [${expected}]}`);
        } else {
            await logger.error(`softAssertCompareArrays :: ${message} {Actual : [${actual}] - Expected  [${expected}]}`);
            testContext.assertsJson.soft.push({ softAssertCompareArrays: "Failed", caseSensitive: `${caseSensitive}`, Actual: `${actual}`, Expected: `${expected}`, message: `${message}`, differnce: `[${diffVals}]` });
        }
    }

    async softContainsOneOfThem(actual: any, expected: string[], message: string, caseSensitive: boolean = false) {
        actual = caseSensitive ? actual.trim() : actual.toLowerCase().trim();
        expected = caseSensitive ? expected : expected.toString().toLowerCase().split(',');;
        let flag = false;
        for (const element of expected) {
            if (actual.includes(element.trim())) flag = true;
        }
        if (flag) {
            await logger.info(`softContainsOneOfThem :: ${message} {Actual : [${actual}] - Expected One of Them [${expected}]}`);
        } else {
            await logger.error(`softContainsOneOfThem :: ${message} {Actual : [${actual}] - Expected One of Them [${expected}]}`);
            testContext.assertsJson.soft.push({ softContainsOneOfThem: "Failed", caseSensitive: `${caseSensitive}`, Actual: `${actual}`, ExpectedOneofThem: `${expected}`, message: `${message}` });
        }
    }

    async softNotContainsOneOfThem(actual: any, expected: string[], message: string, caseSensitive: boolean = false) {
        actual = caseSensitive ? actual.trim() : actual.toLowerCase().trim();
        expected = caseSensitive ? expected : expected.toString().toLowerCase().split(',');;
        let flag = false;
        for (const element of expected) {
            if (actual.includes(element.trim())) {
                flag = true;
            }
        }
        if (flag) {
            await logger.error(`softNotContainsOneOfThem :: ${message} {Actual : [${actual}] - Expected One of Them [${expected}]}`);
            testContext.assertsJson.soft.push({ softContainsOneOfThem: "Failed", caseSensitive: `${caseSensitive}`, Actual: `${actual}`, ExpectedOneofThem: `${expected}`, message: `${message}` });
        } else {
            await logger.info(`softNotContainsOneOfThem :: ${message} {Actual : [${actual}] - Expected One of Them [${expected}]}`);

        }
    }

    async hardAssert(actual: any, expected: any, message: string) {
        if (actual === expected) {
            await logger.info(`hardAssert :: ${message} {Actual : [${actual}] - Expected [${expected}]}`);
        } else {
            await logger.error(`hardAssert :: ${message} {Actual : [${actual}] - Expected [${expected}]}`);
           
        }
        expect(actual, `hardAssert :: ${message} \n{Actual : [${actual}] - Expected [${expected}]}`).toEqual(expected);
    }

    async hardContains(actual: string, expected: string, message: string) {
        if (actual.includes(expected)) {
            await logger.info(`hardContains :: ${message} {Actual : [${actual}] - Expected [${expected}]}`);
        } else {
            await logger.error(`hardContains :: ${message} {Actual : [${actual}] - Expected [${expected}]}`);
        }
        expect(actual, `hardContains :: ${message} \n{Actual : [${actual}] - Expected [${expected}]}`).toContain(expected);
    }

    async hardNotContains(actual: string, expected: string, message: string) {
        if (!actual.includes(expected)) {
            await logger.info(`hardNotContains :: ${message} {String : [${actual}] - Substring [${expected}]}`);
        } else {
            await logger.error(`hardNotContains :: ${message} {String : [${actual}] - Substring [${expected}]}`);
           
        }
        expect(actual, `hardNotContains :: ${message} \n{Actual : [${actual}] - Expected [${expected}]}`).not.toContain(expected);
    }

}

export default new CustomAssert();
