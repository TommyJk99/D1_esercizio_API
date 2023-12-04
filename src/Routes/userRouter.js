import express from "express";
import { User } from "../models/users.js";
import mongoose from "mongoose";
import { checkAuth } from "../middlewares/checkAuth.js";

const userRouter = express.Router();

userRouter.use(express.json());
userRouter.use(checkAuth);

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

userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new User(req.body);

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

userRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedDocument = await User.findByIdAndDelete(req.params.id);

    if (!deletedDocument) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
