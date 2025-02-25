export default class DataBase {

    protected dbConn: any;
    protected conn: any;
    protected dbType: string;
    public queryResult: any;
    protected dbConfig: any;
    constructor(dbType: "oracle" | "mysql" | "sql", dbConfig?: any) {
        this.dbType = dbType;
        this.dbConfig = dbConfig;
    }

    setDbType(dbType: string) {
        this.dbType = dbType;
    }

    setConfig(dbConfig: any) {
        this.dbConfig = dbConfig;
    }

    async executeSelectCmd(query: any, options?: { casesync?: boolean }) {
        this.dbConn = require('oracledb');
        if (this.dbType === 'oracle') {
            try {
                await this.dbConn.getConnection(this.dbConfig).then(async (conn: any) => {
                    this.queryResult = await conn.execute(query);
                    this.dbConn = conn;
                    let _casesync = options?.casesync?.valueOf() !== undefined ? options?.casesync : false;
                    if (!_casesync) {
                        this.queryResult.json = await this.getResultsToJson();
                    }
                })
            } catch (err) {
                console.log('Ouch!', err);
            } finally {
                if (this.dbConn) {// If connection is success, need to close
                    try {
                        await (this.dbConn).close();
                    } catch (err) {
                        console.log('Recheck the connection string', err);
                    }
                }
            }
        } else if (this.dbType === 'mysql') {
            this.dbConn = require('mysql');
            try {
                this.dbConn = await this.dbConn.createConnection(this.dbConfig);
                await this.dbConn.connect();
                await this.dbConn.query(query, (err: any, rows: any, fields: any) => {
                    if (err) throw err
                    this.queryResult = rows;
                })
            } catch (err) {
                console.log('Ouch!', err);
            } finally {
                if (this.dbConn) { // If connection is success, need to close
                    await (this.dbConn).close()
                }
            }
        }
    }

    protected async getResultsToJson() {
        // let res = JSON.parse("{  }");
        let rows = this.queryResult.rows;
        let metaData = this.queryResult.metaData;
        let len = metaData.length;
        let res: any[] = []; // Add type annotation for the 'res' array
        for (const row of rows) {
            let item: string = '';
            for (let i = 0; i < len; i++) {
                if (i === 0) {
                    item = `${item} "${metaData[i].name}": "${row[i]}" `;
                } else {
                    item = `${item}, "${metaData[i].name}": "${row[i]}" `;
                }
            }
            let data: any = `{${item}}`;
            res.push(JSON.parse(data));
        }
        return res;
    }

}
