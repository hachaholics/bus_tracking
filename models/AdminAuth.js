const mongoose = require('mongoose');

const adminAuthSchema = new mongoose.Schema({
  conductorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conductor', required: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  immutable: { type: Boolean, default: true }
});

module.exports = mongoose.model('AdminAuth', adminAuthSchema);
