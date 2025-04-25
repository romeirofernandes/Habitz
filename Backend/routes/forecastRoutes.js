const express = require('express');
const router = express.Router();
const { forecastHabit } = require('../controllers/forecastController');
const auth = require('../middleware/auth');

router.post('/habit', auth, forecastHabit);

module.exports = router;