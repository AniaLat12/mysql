import con from '../database/conection'

class API{
    async main(req: any, res: any): Promise<any> {
        const query = req.session.query;
        let db = req.session.db;
        con.query("show databases", (err: any, dbs: any)=>{
            con.query(query, (err: any, fields: any) => {
                res.status(200).json({data: fields, query, dbs, db})
            })
        })
    }

    async tables(req: any, res: any): Promise<any> {
        con.query(`use ${req.params.db}`, (err: any, d: any)=>{
            con.query(`show tables`, (err: any, tables: any)=>{
                res.status(200).json({ tables, db: req.params.db })
            });
        });
    }

    async desc(req: any, res: any): Promise<any> {
        con.query(`SHOW COLUMNS FROM ${req.params.db}.${req.params.table}`, (err: any, data: any)=>{
            res.status(200).json({
                strucute: data
            })
        })
    }
    /**
     * send qeury to database and return results in res
     * @param req 
     * @param res 
     */
    async query(req: any, res: any): Promise<any> {
        try {
            con.query(`use ${req.params.db}`, ()=>{
                con.query(req.body.data, (err: any, data: any)=>{
                    res.status(200).json({ data })
                })
            })
        } catch (error) {
            res.status(400).json({ error })
        }
    }
    /**
     * insert data into database
     * @param req 
     * @param res 
     */
    async insert(req: any, res: any): Promise<any> {
        try {
            /**
             * 
             * @param {element}
             * @exports
             * 
             * Add date parser support and error
             */
            const formatedBody = req.body.reqBody.vals.map(function(e: any){
                if(isNaN(parseInt(e)) && (e !== "null" && e !== "Null" && e !== "NULL") ){
                    return `"${e}"`;
                } else { return e; }
            })
            /**
             * @alias ${formatedBody} use db and insert data in
             * add error
             */
            await con.query(`use ${req.params.db}`, ()=>{
                con.query(`INSERT INTO ${req.params.table}(${req.body.reqBody.alias}) VALUES(${formatedBody})`, (err: any)=>{
                    if(err) console.log(err);
                    else res.status(200).json({message: "success"})
                });
            })
        } catch (error) {
            res.status(401).json({error})
        }
    }
}

export default new API();
