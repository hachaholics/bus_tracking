const mongoose = require('mongoose');

const busStatusSchema = new mongoose.Schema({
  busNo: { type: String, ref: 'Bus', required: true },
  conductorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conductor', required: true },
  status: {
    type: String,
    enum: ['vacant', 'limited_seats', 'no_seats_left', 'no_space_to_stand'],
    default: 'vacant'
  },
  shiftActive: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BusStatus', busStatusSchema);
