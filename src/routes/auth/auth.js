import { Router } from "express";
import { register } from "../../controllers/auth.js";

export const authRouter = Router();

authRouter.post("/register", register);
