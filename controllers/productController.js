const Product = require("../models/products");
const Review = require("../models/reviews");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public

const createProduct = async (req, res) => {
  const userId = req.user.userId;

  const products = await Product.create({
    ...req.body,
    user: userId,
  });
  res.status(StatusCodes.CREATED).json({ products });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
};

const getProductById = async (req, res) => {
  const { id: productId } = req.params;
  //   const product = await Product.findOne({ _id: productId });
  const product = await Product.findById(productId).populate({
    path: "reviews",
    select: "rating comment",
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ updatedProduct });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findByIdAndDelete(productId, { active: false });
  const review = await Review.deleteMany({ product: productId });

  if (!product || !review) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Success!!! Product deleted" });
};

const updateProductImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("Please upload a file");
  }
  const file = req.files.image;

  if (!file.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image file");
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    throw new CustomError.BadRequestError(
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
    );
  }

  const filePath = path.join(__dirname, `../public/uploads/${file.name}`);
  await file.mv(filePath);

  res
    .status(StatusCodes.OK)
    .json({ filePath, msg: "Success!!! Image uploaded" });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductImage,
};
