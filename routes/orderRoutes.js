const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getCurrentUserOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.post("/", authenticateUser, createOrder);

router.get("/", authenticateUser, authorizePermissions("admin"), getAllOrders);

router.get("/:id", authenticateUser, getOrderById);

router.get("/show/me", authenticateUser, getCurrentUserOrders);

router.patch("/:id", authenticateUser, updateOrder);

router.delete("/:id", authenticateUser, deleteOrder);

module.exports = router;
