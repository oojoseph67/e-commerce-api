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
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price description",
  });

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getReviewById = async (req, res) => {
  const { id: reviewId } = req.params;

  if (!reviewId) {
    throw new CustomError.BadRequestError("Please provide a review id");
  }

  const review = await Review.findById(reviewId).populate({
    path: "product",
    select: "name company price description",
  });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { params, body } = req;
  const { id: reviewId } = params;
  const { rating, title, comment } = body;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }

  checkPermissions(req.user, review.user);

  //   const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
  //     new: true,
  //     runValidators: true,
  //   });

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.remove();

  res.status(StatusCodes.OK).json({ msg: "Success!!! Review deleted" });
};

const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;

  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
