const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coachController');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// @route   POST api/coach
// @desc    Get habit coaching advice
// @access  Private
router.post('/', coachController.getCoachingAdvice);

module.exports = router;