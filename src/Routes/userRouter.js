import express from "express";
import { User } from "../models/users.js";
import mongoose from "mongoose";

const userRouter = express.Router();

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

userRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send();
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
