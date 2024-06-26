const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductImage,
} = require("../controllers/productController");

const { getSingleProductReview } = require("../controllers/reviewController");

router.post(
  "/",
  authenticateUser,
  authorizePermissions("admin"),
  createProduct
);

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.get("/:id/reviews", authenticateUser, getSingleProductReview);

router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  updateProduct
);

router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  deleteProduct
);

router.post(
  "/updateProductImage",
  authenticateUser,
  authorizePermissions("admin"),
  updateProductImage
);

module.exports = router;
