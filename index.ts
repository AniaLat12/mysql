import express from 'express';
import cors from 'cors';
import router from './routes/index.router';
const 
    app     = express(),
    port    = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use("/", router);
app.use(()=>import("./middleware/cors.middleware"));
app.listen(port, () => console.log(`listen ${port}!`));
