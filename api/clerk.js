import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "../server/configs/db.js"; // adjust path
import clerkWebhooks from "../server/controllers/clerkWebHooks.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Clerk webhook route
app.post("/", clerkWebhooks);

// Export as Vercel serverless function
export default app;
