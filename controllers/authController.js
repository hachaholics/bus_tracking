const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Conductor = require('../models/Conductor');
const AdminAuth = require('../models/AdminAuth');

// Generate random 6-letter password
function generatePassword(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

// Signup
exports.signup = async (req, res) => {
  try {
    const { conductorId, name, phone } = req.body;

    // Check existing
    let conductor = await Conductor.findOne({ conductorId });
    if (conductor) return res.status(400).json({ message: 'Conductor already exists' });

    // Save conductor
    conductor = new Conductor({ conductorId, name, phone });
    await conductor.save();

    // Generate password
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await new AdminAuth({
      conductorId: conductor._id,
      username: conductorId,
      passwordHash: hashedPassword
    }).save();

    res.status(201).json({
      message: 'Signup successful',
      conductorId,
      password: plainPassword
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { conductorId, password } = req.body;

    const conductor = await Conductor.findOne({ conductorId });
    if (!conductor) return res.status(400).json({ message: 'Conductor not found' });

    const auth = await AdminAuth.findOne({ conductorId: conductor._id });
    if (!auth) return res.status(400).json({ message: 'Auth record not found' });

    const isMatch = await bcrypt.compare(password, auth.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { conductorId: conductor._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, conductorId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};