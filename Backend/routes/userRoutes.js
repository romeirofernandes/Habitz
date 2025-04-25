const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.use(auth);

// Get user by ID
router.get("/:userId", userController.getUserById);

module.exports = router;