import express from "express";

const server = express();
const port = 3030;

server.listen(port, () => {
  console.log("Server listening at port:", port);
});
