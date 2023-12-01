import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const server = express();
const port = 3030;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(port, () => {
      console.log("🍇 Server listening to port:", port);
    });
  })
  .catch(() => {
    console.log("Errore nella connessione al DB", process.env.MONGO_URL);
  });
