import dotenv from "dotenv";
import connectToDatabase from "./src/database/connect.js";
import "./src/routes/index.js";

dotenv.config();
connectToDatabase();
