const Product = require("../models/products");
const User = require("../models/user");

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public

const createProduct = async (req, res) => {
  res.send("create product");
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ products });
};

const getProductById = async (req, res) => {
  res.send("get product by id");
};

const updateProduct = async (req, res) => {
  res.send("update product");
};

const deleteProduct = async (req, res) => {
  res.send("delete product");
};

const updateProductImage = async (req, res) => {
  res.send("update product image");
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductImage,
};
