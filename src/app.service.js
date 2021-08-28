/* eslint-disable no-unused-vars */

const dbService = require("./db.service");

module.exports = (db, logger) => {
  return {
    createRide: async (req, res) => {
      const startLatitude = Number(req.body.start_lat);
      const startLongitude = Number(req.body.start_long);
      const endLatitude = Number(req.body.end_lat);
      const endLongitude = Number(req.body.end_long);
      const riderName = req.body.rider_name;
      const driverName = req.body.driver_name;
      const driverVehicle = req.body.driver_vehicle;

      if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
        });
      }

      if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
        });
      }

      if (typeof riderName !== "string" || riderName.length < 1) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "Rider name must be a non empty string"
        });
      }

      if (typeof driverName !== "string" || driverName.length < 1) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "Driver name must be a non empty string"
        });
      }

      if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
        return res.send({
          error_code: "VALIDATION_ERROR",
          message: "Vehicle name must be a non empty string"
        });
      }

      const values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
      try {
        const insert = await dbService.run("INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)", db, values);
        const ride = await dbService.get("SELECT * FROM Rides WHERE rideID = ?", db, insert.lastID);
        res.send(ride);
      } catch (err) {
        logger.error(err.message);
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error"
        });
      }
    },

    getRides: async (req, res) => {
      try {
        const { page = 1, size = 5 } = req.query;
        const rides = await dbService.all("SELECT * FROM Rides LIMIT ?,?", db, [(page - 1) * size, size]);
        res.send(rides);
      } catch (err) {
        logger.error(err.message);
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error"
        });
      }
    },

    getRideById: async (req, res) => {
      try {
        const ride = await dbService.get(`SELECT * FROM Rides WHERE rideID="${req.params.id}"`, db);
        res.send(ride);
      } catch (err) {
        logger.error(err.message);
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error"
        });
      }
    }
  };
};