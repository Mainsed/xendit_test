"use strict";

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

module.exports = (db) => {
  const service = require("./app.service")(db, logger);
  app.get("/health", (req, res) => res.send("Healthy"));
  app.post("/rides", jsonParser, service.createRide);
  app.get("/rides", service.getRides);
  app.get("/rides/:id", service.getRideById);
  return app;
};
