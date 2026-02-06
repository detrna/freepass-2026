const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const { authenticate } = require("../middleware/authenticate");
const { roleGuard } = require("../middleware/roleGuard");

router.post(
  "/",
  authenticate,
  roleGuard("student"),
  feedbackController.createFeedback,
);
router.get("/", authenticate, feedbackController.viewFeedbackList);
router.delete("/", authenticate, feedbackController.deleteFeedback);

module.exports = router;
