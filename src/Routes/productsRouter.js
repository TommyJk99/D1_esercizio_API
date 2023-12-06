import { Product } from "../models/products.js";
import express from "express";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = Product.findById({});
    res.json(products);
  } catch (err) {
    next(err);
  }
});
