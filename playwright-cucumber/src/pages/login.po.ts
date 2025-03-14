import { gotoUrl, UiElement } from "@qe-solutions/playwright-test-wrappers";

export class LoginPage {
    // locators declaration
    locator_name = '#user-name';
    locator_password = '#password';
    locator_login = '#login-button';

    //object declaration
    txt_name = new UiElement(this.locator_name, { description: 'Login Name text box' });
    txt_password = new UiElement(this.locator_password, { description: 'Login Password text box' });
    btn_login = new UiElement(this.locator_login, { description: 'Login button' });

    //methods
    async login(userName: string, password: string) {
        await this.txt_name.type(userName);
        await this.txt_password.type(password);
        await this.btn_login.click();
    }

    async launch(url: string) {
        await gotoUrl(url);
    }
}