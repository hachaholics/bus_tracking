const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true }
});

const busRouteSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  stops: [stopSchema]
});

const BusRoute = mongoose.model("BusRoute", busRouteSchema);

module.exports = BusRoute;
