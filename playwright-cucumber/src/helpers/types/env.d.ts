export { };
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENV: "dev" | "test" | "stage";
            URL: string;
            APIURL: string;
            BROWSER: string;
            HEADED: "true" | "false";
        }
    }
}   