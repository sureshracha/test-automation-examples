import * as dotenv from 'dotenv';
export const getEnv = async () => {
    dotenv.config({
        override: true,
        path: `src/helpers/env/env/.env.${process.env.ENV}`
    });
}