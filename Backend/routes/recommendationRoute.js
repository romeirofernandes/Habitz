const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateRecommendations } = require('../controllers/recommendationController');

// @route   POST api/recommendations
// @desc    Generate habit recommendations based on user data
// @access  Private
router.post('/', auth, generateRecommendations);

module.exports = router;