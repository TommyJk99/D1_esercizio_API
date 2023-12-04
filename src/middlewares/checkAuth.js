import dotenv from "dotenv";
dotenv.config();

export const checkAuth = (req, res, next) => {
  //per passare questo mdw devo avere tra gli header l'authorization
  if (req.headers.authorization === process.env.PSSW) {
    next(); //serve per passare al middleware successivo
  } else {
    res.status(401).json({ error: "password sbagliata" });
  }
};
