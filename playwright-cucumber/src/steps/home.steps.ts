import { Then, setDefaultTimeout } from '@cucumber/cucumber';
import { HomePage } from '../pages/home.po';
setDefaultTimeout(160000);
Then('Check home page displayed', async () => {
    await new HomePage().checkHomePageExisted();
});