import express from "express";
import { Product } from "../models/products.js";

const productsRouter = express.Router();
productsRouter.use(express.json());

//sintassi alternativa di router.get(...)
//è possibile concatenare .post a .get perché get resistuisce un'istanza di products Router
productsRouter
  .get("/", async (req, res, next) => {
    try {
      // Estrai i parametri di query e imposta i valori predefiniti
      let { limit = 10, skip = 0, sortBy = "createdAt", order = "asc" } = req.query;

      // Converti limit e skip in numeri e verifica che siano positivi
      limit = Math.max(parseInt(limit, 10), 1); // Imposta un limite minimo di 1
      skip = Math.max(parseInt(skip, 10), 0); // Evita valori negativi per skip

      // Verifica che sortBy e order siano valori accettabili
      const allowedSortFields = ["createdAt", "price"]; // Aggiungi qui eventuali altri campi consentiti
      const allowedOrders = ["asc", "desc"];
      if (!allowedSortFields.includes(sortBy)) sortBy = "createdAt";
      if (!allowedOrders.includes(order)) order = "asc";

      // Opzioni di filtro per il prezzo
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.price = { ...priceFilter.price, $gte: parseInt(req.query.minPrice, 10) };
      if (req.query.maxPrice) priceFilter.price = { ...priceFilter.price, $lte: parseInt(req.query.maxPrice, 10) };

      // Costruisci e esegui la query
      const query = Product.find(priceFilter)
        .sort({ [sortBy]: order })
        .limit(limit)
        .skip(skip);

      const products = await query;

      // Invia la risposta
      res.json(products);
    } catch (err) {
      // Gestione degli errori
      next(err);
    }
  })

  // .get("/", async (req, res, next) => {
  //   try {
  //     const { limit, skip, sortBy, order } = req.query;
  //     const products = await Product.find({
  //       $and: [{ price: { $gte: 100 } }, { price: { $lte: 600 } }],
  //     })
  //       .sort({ [sortBy]: order })
  //       .limit(limit)
  //       .skip(skip);
  //     res.json(products);
  //   } catch (err) {
  //     next(err);
  //   }
  // })
  // .get("/", async (req, res, next) => {
  //   try {
  //     const { limit, skip, sortBy, order } = req.query;
  //     const products = await Product.find({});
  //     // .limit(limit)
  //     // .skip(skip)
  //     // .sort({ [sortBy]: order }); //restituisce solo 2 elementi!
  //     res.json(products);
  //   } catch (err) {
  //     next(err);
  //   }
  // })
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
