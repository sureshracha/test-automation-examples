import * as dotenv from 'dotenv';
export const getEnv = async () => {
    dotenv.config({
        override: true,
        path: `playwright-cucumber/src/helpers/env/.env.${process.env.ENV}`
    });
}