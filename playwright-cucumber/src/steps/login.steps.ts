import { Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/login.po';
const loginData = require('../testdata/ref/loginDetails.json');
const loginPage = new LoginPage();
Then('Launch and login to application', async () => {
    await loginPage.launch();
    await loginPage.login(loginData.username, loginData.password);
});