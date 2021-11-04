const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql');
const session = require('express-session');
const cors = require('cors');
app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// query use db 
// MAKE DB ENGINE 

// class Engine{
//     constructor(db){
//         this.db = db;
//         this.connect();
//     }

//     connect(){
//     }
// }

// SELECT * FROM nauczyciel

const con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
})
con.connect();

// con.query("show COLUMNS FROM dziennik.klasa ", (e, d)=>{console.log(d);})

// const eg = new Engine("dziennik");
// const con = eg.connect();


app.get('/', async function(req, res)  {
    const query = req.session.query;
    let db = req.session.db;
    con.query("show databases", (err, dbs)=>{ //get all
        con.query(query, (err, fields) => {
            // res.render('index', {data: fields, query: query, dbs: dbs, tables: tables, db: db})
            res.status(200).json({data: fields, query, dbs, db})
        })
    })
});

// use db and send tables is in
app.get("/db/:db", async (req, res)=>{
    req.session.db = req.params.db;
    con.query(`use ${req.params.db}`, (err, d)=>{
        con.query(`show tables`, (err, tables)=>{
            res.status(200).json({ tables, db: req.params.db })
        });
    });
})

// describe select table
app.get("/desc/:db/:table", (req, res)=>{
    con.query(`SHOW COLUMNS FROM ${req.params.db}.${req.params.table}`, (err, data)=>{
        res.status(200).json({
            strucute: data
        })
    })
})

app.post('/query/:db', async function(req, res) {
    try {
        con.query(`use ${req.params.db}`, ()=>{
            con.query(req.body.data, (err, data)=>{
                res.status(200).json({ data })
            })
        })
    } catch (error) {
        res.status(400).json({ error })
    }
});

app.listen(port, () => console.log(`Example app listening on port port!`))
