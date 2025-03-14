import { Then, setDefaultTimeout } from '@cucumber/cucumber';
import { LoginPage } from '../pages/login.po';
const loginData = require('../testdata/ref/loginDetails.json');
setDefaultTimeout(160000);
Then('Launch and login to application', async () => {
    const loginPage = new LoginPage();
    await loginPage.launch("https://www.saucedemo.com/");
    await loginPage.login(loginData.username, loginData.password);
});