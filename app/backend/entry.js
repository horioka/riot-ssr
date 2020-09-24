/** @format */

import dotenv from "dotenv";
import express from "express";
import router from "express-promise-router";
import bodyParser from "body-parser";

import api from "./api.js";
import ssr from "./ssr.js";

dotenv.config();

const app = express();
const route = router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", route);
api.register(route);
ssr.register(route);

app.use(express.static("app/public"));

app.listen(process.env.SERVER_PORT, () => {
  console.log("listening on port " + process.env.SERVER_PORT);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("express terminated.");
  });
});
