import express from "express";
import userRouter from "./userRouter.js";
import productsRouter from "./productsRouter.js";

const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.use("/users", userRouter);
apiRouter.use("/products", productsRouter);

export default apiRouter;
