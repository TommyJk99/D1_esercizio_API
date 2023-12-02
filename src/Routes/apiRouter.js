import express from "express";
import userRouter from "./userRouter.js";

const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.use("/users", userRouter);

export default apiRouter;
