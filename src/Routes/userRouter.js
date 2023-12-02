import express from "express";
import { User } from "../models/users.js";

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/test", async (req, res) => {
  res.json({ message: "Users router is working! ❤️" });
});

export default userRouter;
