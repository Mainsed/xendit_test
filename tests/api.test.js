/* eslint-disable no-undef */
"use strict";

const request = require("supertest");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

const app = require("../src/app")(db);
const buildSchemas = require("../src/schemas");

describe("API tests", () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
    service = require("../src/app.service")(db);
  });

  describe("GET /health", () => {
    it("should return health", (done) => {
      request(app)
        .get("/health")
        .expect("Content-Type", /text/)
        .expect(200, done);
    });
  });

  describe("POST /rides", () => {
    it("should create ride", (done) => {
      request(app)
        .post("/rides")
        .send({
          "start_lat": "65", "start_long": "165", "end_lat": "75", "end_long": "175",
          "rider_name": "rider", "driver_name": "driver", "driver_vehicle": "veh"
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else if (res.body.error_code) done(res.body);
        });
      done();
    });

    it("should return error with start latitude while creating a ride", (done) => {
      request(app)
        .post("/rides")
        .send({
          "start_lat": "95", "start_long": "195", "end_lat": "75", "end_long": "175",
          "rider_name": "rider", "driver_name": "driver", "driver_vehicle": "veh"
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else if (res.body.error_code) done();
        });
    });

    it("should return error with driver vehicle while creating a ride", (done) => {
      request(app)
        .post("/rides")
        .send({
          "start_lat": "65", "start_long": "165", "end_lat": "75", "end_long": "175",
          "rider_name": "rider", "driver_name": "driver", "driver_vehicle": ""
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else if (res.body.error_code) done();
        });
    });

    it("should return error with rider name while creating a ride", (done) => {
      request(app)
        .post("/rides")
        .send({
          "start_lat": "65", "start_long": "165", "end_lat": "75", "end_long": "175",
          "rider_name": "", "driver_name": "driver", "driver_vehicle": "veh"
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else if (res.body.error_code) done();
        });
    });

    it("should return error with end latitude  while creating a ride", (done) => {
      request(app)
        .post("/rides")
        .send({
          "start_lat": "65", "start_long": "165", "end_lat": "95", "end_long": "175",
          "rider_name": "rider", "driver_name": "driver", "driver_vehicle": "veh"
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else if (res.body.error_code) done();
        });
    });

    it("should return error with driver name while creating a ride", (done) => {
      request(app)
        .post("/rides")
        .send({
          "start_lat": "65", "start_long": "165", "end_lat": "75", "end_long": "175",
          "rider_name": "rider", "driver_name": "", "driver_vehicle": "veh"
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else if (res.body.error_code) done();
        });
    });

    it("should return error with SQL Injection while creating a ride", (done) => {
      request(app)
        .post("/rides")
        .send({
          "start_lat": "65 AND 26", "start_long": "165", "end_lat": "75", "end_long": "175",
          "rider_name": "rider", "driver_name": "", "driver_vehicle": "veh"
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) done(err);
          else if (res.body.error_code) done();
        });
    });
  });

  describe("GET /rides", () => {
    it("should return 8 or less rides", (done) => {
      request(app)
        .get("/rides?page=1&size=8")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          const body = res.body;
          if (err) done(err);
          else if (body.error_code && body.error_code !== "RIDES_NOT_FOUND_ERROR") done(body);
        });
      done();
    });
  });

  describe("GET /rides/:id", () => {
    it("should return ride with id", (done) => {
      request(app)
        .get("/rides/1")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          const body = res.body[0];
          if (err) done(err);
          else if (body.error_code) done(body);
        });
      done();
    });

    it("should return error while finding ride with incorrect id", (done) => {
      request(app)
        .get("/rides/asd")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          const body = res.body;
          if (err) done(err);
          else if (body.rideID) done("Found unexpected ride");
        });
      done();
    });
  });
});