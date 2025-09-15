const mongoose = require('mongoose');

const conductorSchema = new mongoose.Schema({
  conductorId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true }
});

module.exports = mongoose.model('Conductor', conductorSchema);
