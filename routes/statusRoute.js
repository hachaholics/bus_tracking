const express = require('express');
const { startShift, updateStatus, endShift } = require('../controllers/statusController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// All require authentication
router.post('/start-shift', authMiddleware, startShift);
router.put('/status', authMiddleware, updateStatus);
router.post('/end-shift', authMiddleware, endShift);

module.exports = router;