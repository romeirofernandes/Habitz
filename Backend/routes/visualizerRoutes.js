const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  generateVisualization,
  saveVisualization,
  getAllVisualizations,
  getVisualization,
  deleteVisualization
} = require('../controllers/visualizerController');

// Generate a visualization from a habit
router.post('/generate', auth, generateVisualization);

// Save a visualization
router.post('/save', auth, saveVisualization);

// Get all visualizations for a user
router.get('/all', auth, getAllVisualizations);

// Get a single visualization
router.get('/:id', auth, getVisualization);

// Delete a visualization
router.delete('/:id', auth, deleteVisualization);

module.exports = router;