import { Router } from "express";
import {
  read,
  readAllFromAuthor,
  create,
  update,
  remove,
  removeAllFromAuthor,
} from "../../controllers/task.js";
import checkToken from "../../middlewares/auth.js";

export const taskRouter = Router();

taskRouter.get("/:id", checkToken, read);
taskRouter.post("/", checkToken, create);
taskRouter.patch("/:id", checkToken, update);
taskRouter.delete("/:id", checkToken, remove);

taskRouter.get("/author/:author", checkToken, readAllFromAuthor);
taskRouter.delete("/author/:author", checkToken, removeAllFromAuthor);
