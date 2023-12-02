import express from "express";
import { User } from "../models/users.js";

const userRouter = express.Router();
userRouter.use(express.json());

//ESEMPIO DI CHIAMTA GET A MONGODB TRAMITE MONGOOSE DENTRO LA NOSTRA APPLICAZIONE SCRITTA CON EXPRESS
userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}, "name");
    const name = users.map((user) => user.name);
    res.json(name);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
