const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");
const auth = require("../middleware/auth");

// Protect all routes
router.use(auth);

router.get("/", habitController.getHabits);
router.post("/", habitController.createHabit);
router.post("/:id/complete", auth, habitController.completeHabit);

module.exports = router;
