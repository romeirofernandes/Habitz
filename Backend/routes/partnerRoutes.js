const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partnerController");
const auth = require("../middleware/auth");

router.use(auth);

// Partner management
router.post("/search", partnerController.searchUsers);
router.post("/request", partnerController.sendPartnerRequest);
router.post("/request/:id/accept", partnerController.acceptRequest);
router.post("/request/:id/decline", partnerController.declineRequest);
router.get("/", partnerController.getPartners);
router.get("/requests/pending", partnerController.getPendingRequests);

// Update chat routes
router.get("/chat/:partnerId", partnerController.getChatHistory);
router.post("/chat/:partnerId/messages", partnerController.sendMessage);

// Add this new route
router.get("/unread-counts", partnerController.getUnreadCounts);

module.exports = router;
