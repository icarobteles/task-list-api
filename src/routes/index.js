import express from "express";
import cors from "cors";

//Import the Routers
import { authRouter } from "./auth/auth.js";
import { userRouter } from "./user/user.js";
import { taskRouter } from "./task/task.js";

const app = express();

app.use(cors());
app.use(express.json());

//Routers
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/task", taskRouter);

export default app;
