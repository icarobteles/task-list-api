import express from "express";
import cors from "cors";

//Import Routers
import { authRouter } from "./auth/auth.js";
import { userRouter } from "./user/user.js";

const app = express();

app.use(cors());
app.use(express.json());

//Routers
app.use("/auth", authRouter);
app.use("/user", userRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Rodando com Express na Porta ${port}!`));
