import express from "express";
import db from "../database.js";

const router = express.Router();

/* GET all telemetry */
router.get("/", (_, res) => {
  const rows = db
    .prepare(
      `
      SELECT *
      FROM telemetry
      ORDER BY id DESC
    `
    )
    .all();

  res.json(rows);
});

/* GET latest telemetry */
router.get("/latest", (_, res) => {
  const row = db
    .prepare(
      `
      SELECT *
      FROM telemetry
      ORDER BY id DESC
      LIMIT 1
    `
    )
    .get();

  res.json(row ?? {});
});

/* GET telemetry for one vehicle */
router.get("/:deviceId", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT *
      FROM telemetry
      WHERE deviceId = ?
      ORDER BY id DESC
    `
    )
    .all(req.params.deviceId);

  res.json(rows);
});

export default router;