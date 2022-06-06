import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoute from "./route/web";
import connection from './configs/connectDB';
import initAPIRoute from "./route/api";

require('dotenv').config();
let morgan = require('morgan');


const app = express();
const port = process.env.PORT || 8081;

app.use(morgan('combined'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//set-up view engine
configViewEngine(app);

//route init
initWebRoute(app);

//api init
initAPIRoute(app);

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`)
});