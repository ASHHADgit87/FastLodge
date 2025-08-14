import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebHooks.js"


connectDB();

const app = express();
app.use(cors());

app.use(express.json())
app.use(clerkMiddleware());
 
app.use("/api/clerk", clerkWebhooks);

app.get('/' , (req,res) => res.send("API is working"))



const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`server working at port ${PORT}`)
})