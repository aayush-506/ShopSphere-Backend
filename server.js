import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import orderRoutes from './routes/orderRoutes.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors({
  origin: true, 
  credentials: true 
}));

// api endpoint
app.use('/api/user',userRouter);

app.use('/api/product',productRouter);

app.use('/api/order', orderRoutes);


app.get("/",(req,res)=>{
    res.send("api working")
})


app.listen(port , console.log("server is started at port:" + port))