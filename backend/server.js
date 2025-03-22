import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import axios from "axios";

//app config
const app=express();
const port=process.env.PORT||4000;
connectDB();
connectCloudinary();

// app middleware
app.use(express.json());
app.use(cors());

const url = process.env.SERVER_BACKEND_URL;
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);

//app endpoint
app.use('/api/admin',adminRouter);//localhost:4000/api/admin/add-doctor
app.use('/api/doctor',doctorRouter);
app.use('/api/user',userRouter);

app.get('/',(req,res)=>{
    res.send("ApI working ");
})

app.listen(port,()=>console.log("Server Started",port));