import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './mongodb/connectDb.js';
import postRoutes from './routes/postRoutes.js'
import DalleRoutes from './routes/DalleRoutes.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use('/api/v1/post',postRoutes);
app.use('/api/v1/dalle',DalleRoutes);

app.get('/',async(req,res)=>{
    res.send("Hello world");
})

try{
    connectDB(process.env.MONGODB_URI);
    app.listen(5000 , ()=>{
        console.log("connect");
    })
}catch(error){
    console.log("ERROR IN connecting",error.message);
}
