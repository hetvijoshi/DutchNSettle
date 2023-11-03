const config = require('../config/appconfig');
const mongoose = require("mongoose");
var debug = require('debug')('dutchnsettle-api:server');


const mongoString = process.env.DB_URL;

function connect() {
  debug("Connecting database...", "info");
  try {
    mongoose.connect(mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Successfully connected
    mongoose.connection.on("connected", function () {
      debug("Databse connected", "info");
    });

    // If the connection throws an error
    mongoose.connection.on("error", function (err) {
      debug("Mongoose default connection error: " + err, "error");
    });

    // Connection is disconnected
    mongoose.connection.on("disconnected", function () {
      debug("Mongoose default connection disconnected", "info");
    });

    // Mongoose connection gracefully shutdown
    process.on("SIGINT", function () {
      mongoose.connection.close(function () {
        debug(
          "Mongoose default connection disconnected through app termination", "info"
        );
        process.exit(0);
      });
    });
  } catch (error) {
    debug(error);
  }
}

module.exports = {
  connect: connect
};