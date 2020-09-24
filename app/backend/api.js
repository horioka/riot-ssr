/** @format */

import multer from "multer";
import db from "./database.js";

let upload = multer();

export default {
  register: (router) => {
    router.get("/api/get-message", async (req, res) => {
      res.send("hello world!!");
    });

    router.post("/api/square", upload.array(), async (req, res) => {
      res.json({ status: "succeed", data: req.body.value * req.body.value });
    });

    router.post("/api/run-sql", upload.array(), async (req, res) => {
      try {
        res.json({ status: "succeed", data: await db.runSql(req.body.sql) });
      } catch (e) {
        res.json({ status: "failed", data: e.message });
      }
    });
  },
};
