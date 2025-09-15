const Bus = require('../models/Bus');
const BusStatus = require('../models/BusStatus');

// Start Shift
exports.startShift = async (req, res) => {
  try {
    const { busNo } = req.body;
    const conductorId = req.user.conductorId; // from middleware

    const bus = await Bus.findOne({ busNo });
    if (!bus) return res.status(400).json({ message: 'Bus not found' });

    let status = await BusStatus.findOne({ conductorId, busNo });
    if (!status) {
      status = new BusStatus({ conductorId, busNo, shiftActive: true, status: 'vacant' });
    } else {
      status.shiftActive = true;
      status.status = 'vacant';
    }

    await status.save();
    res.json({ message: 'Shift started', busNo, status: status.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const conductorId = req.user.conductorId;

    const busStatus = await BusStatus.findOne({ conductorId, shiftActive: true });
    if (!busStatus) return res.status(400).json({ message: 'No active shift' });

    busStatus.status = status;
    busStatus.lastUpdated = Date.now();
    await busStatus.save();

    res.json({ message: 'Status updated', status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// End Shift
exports.endShift = async (req, res) => {
  try {
    const conductorId = req.user.conductorId;

    const busStatus = await BusStatus.findOne({ conductorId, shiftActive: true });
    if (!busStatus) return res.status(400).json({ message: 'No active shift' });

    busStatus.shiftActive = false;
    busStatus.status = 'vacant';
    await busStatus.save();

    res.json({ message: 'Shift ended and status reset' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};