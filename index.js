const dotenv = require("dotenv").config();
const express = require("express");
const passport = require("passport");
const Mongo_Database = require("./db_connection/db.connection");
const userRoute = require("./routes/user.route");
const todoRouter = require("./routes/todo.route");
const AuthMiddleware = require("./middlewares/auth.middleware");
const cors = require("cors");
const policyRoute = require("./privacy/policy");
const termsRoute = require("./terms/terms");

const server = express();
server.use(cors({ origin: "*" }));
server.use(express.json());

server.use("/user", userRoute);
server.use("/todo", AuthMiddleware, todoRouter);
server.use("/secure", policyRoute);
server.use("/term", termsRoute);

server.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to home buddy",
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  Mongo_Database();
  console.log(`Server is listening on port ${PORT}`);
});
