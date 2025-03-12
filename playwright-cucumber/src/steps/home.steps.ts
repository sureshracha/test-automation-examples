import { Then } from '@cucumber/cucumber';
import { HomePage } from '../pages/home.po';

Then('Check home page displayed', async () => {
    await new HomePage().checkHomePageExisted(); 
});