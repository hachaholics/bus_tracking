const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNo: {
    type: String,
    required: true,
    unique: true,
    match: /^TS\d{2}[A-Z]{2}\d{4}$/  // TS01AB1234
  },
  routeNo: {
    type: String,
    required: true,
    match: /^\d{3}[A-Z]{0,2}$/       // 101, 101A, 101AB
  },
  type: { type: String, enum: ['metro', 'express', 'local', 'intercity'], required: true },
  capacity: Number,
  route: String
});

module.exports = mongoose.model('Bus', busSchema);
