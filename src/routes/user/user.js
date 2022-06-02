import { Router } from "express";
import { readById, remove, update } from "../../controllers/user.js";
import checkToken from "../../middlewares/auth.js";

export const userRouter = Router();

userRouter.get("/:id", checkToken, readById);
userRouter.patch("/:id", checkToken, update);
userRouter.delete("/:id", checkToken, remove);
