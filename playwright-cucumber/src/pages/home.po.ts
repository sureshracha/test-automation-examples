import { UiElement } from "@qe-solutions/playwright-test-wrappers";
import { customLogger, customAssert } from "@qe-solutions/test-automation-library";

export class HomePage {
    // locators declaration
    locator_menuIcon = '#react-burger-menu-btn';

    //object declaration
    icnMenu = new UiElement(this.locator_menuIcon, { description: 'Menu Icon' });

    //methods
    async checkHomePageExisted() {
        await customLogger.info('Checking Home Page Existed');
        let flag = await this.icnMenu.isExist();
        await customAssert.softAssert(flag, true, 'Home Page is not Existed');

    }
}