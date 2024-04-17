const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");

const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/", authenticateUser, createReview);

router.get("/", authenticateUser, getAllReviews);

router.get("/:id", authenticateUser, getReviewById);

router.patch("/:id", authenticateUser, updateReview);

router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;
