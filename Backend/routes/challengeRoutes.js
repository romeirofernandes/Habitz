const express = require("express");
const router = express.Router();
const challengeController = require("../controllers/challengeController");
const auth = require("../middleware/auth");

router.use(auth);

router.post("/", challengeController.createChallenge);
router.get("/", challengeController.getChallenges);
router.post("/:challengeId/join", challengeController.joinChallenge);
router.post("/:challengeId/progress", challengeController.updateProgress);

module.exports = router;