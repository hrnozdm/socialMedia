import express,{ Express,Request,Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/router";
const db=require('./config/db.js');
dotenv.config();
const PORT=process.env.PORT;
const app=express();
app.use(morgan('common'))
app.use(helmet())
app.use(express.json())
db();
app.use('/api',router);

app.listen(PORT,()=>{
    console.log(`Server is port on ${PORT} `);
})

