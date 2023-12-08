import express from "express";
import { Product } from "../models/products.js";

const productsRouter = express.Router();
productsRouter.use(express.json());

//sintassi alternativa di router.get(...)
//è possibile concatenare .post a .get perché get resistuisce un'istanza di products Router
productsRouter
  .get("/", async (req, res, next) => {
    try {
      const { limit, skip, sortBy, order } = req.query;
      const products = await Product.find({})
        .limit(limit)
        .skip(skip)
        .sort({ [sortBy]: order }); //restituisce solo 2 elementi!
      res.json(products);
    } catch (err) {
      next(err);
    }
  })
  .get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).send();
      }
      res.json(product);
    } catch (err) {
      next(err);
    }
  })

  .post("/", async (req, res, next) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(200).json(newProduct);
    } catch (err) {
      next(err);
    }
  })
  .put("/:id", async (req, res, next) => {
    try {
      const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(updateProduct);
    } catch (err) {
      next(err);
    }
  })
  .delete("/:id", async (req, res, next) => {
    try {
      const deletedDocument = await Product.findByIdAndDelete(req.params.id);
      res.status(!deletedDocument ? 404 : 204).send();
    } catch (error) {
      next(error);
    }
  });

export default productsRouter;
