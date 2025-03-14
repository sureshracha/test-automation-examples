export { };
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENV: "dev" | "test" | "stage";
            APPURL: string;
            APIURL: string;
            BROWSER: string;
            HEADED: "true" | "false";
        }
    }
}   