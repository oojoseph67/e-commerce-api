const Product = require("../models/products");
const Review = require("../models/reviews");
const User = require("../models/user");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils/checkPermissions");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const { userId } = req.user;

  const user = await User.findById(userId);

  const isValidProduct = await Product.findById(productId);
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "You have already submitted a review for this product"
    );
  }

  if (checkPermissions(req.user, user)) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to submit a review"
    );
  }

  const review = await Review.create({
    ...req.body,
    user: userId,
    product: productId,
  });
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getReviewById = async (req, res) => {
  const { id: reviewId } = req.params;

  if (!reviewId) {
    throw new CustomError.BadRequestError("Please provide a review id");
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedReview) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }

  if (req.user.userId !== updatedReview.user.toString()) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to update this review"
    );
  }

  checkPermissions(req.user, review.user);

  res.status(StatusCodes.OK).json({ updatedReview });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }

  checkPermissions(req.user, review.user);

  res.status(StatusCodes.OK).json({ msg: "Success!!! Review deleted" });
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
