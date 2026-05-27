import express from 'express';
import 'dotenv/config' 
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";

import dns from "node:dns/promises"
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])


const app=express();
const PORT=process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser()); 

app.use('/api/auth',authRoutes);

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port:${PORT}`);
})