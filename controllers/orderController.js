const Order = require("../models/order");
const Product = require("../models/products");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils/checkPermissions");

const createOrder = async (req, res) => {
  const { user, body } = req;
  const { userId } = user;
  const { items: cartItems, tax, shippingFee } = body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("Cart is empty");
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("Tax and Shipping Fee are required");
  }

  let orderItems = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findById(item.product);
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id : ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;
    const singleOrderItems = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems.push(singleOrderItems);
    subTotal += price * item.amount;
  }

  const total = subTotal + tax + shippingFee;
  const paymentIntent = "pi_1J2e9731gj9FZGg5Q";

  const order = await Order.create({
    user: userId,
    cartItems: orderItems,
    tax,
    shippingFee,
    subTotal,
    total,
    paymentIntent,
  })

  res.status(StatusCodes.CREATED).json({ msg: "Order created", paymentIntent, order });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate("product");

  res.status(StatusCodes.OK).json({ orders });
};

const getOrderById = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId).populate("product");

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }

  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const { userId } = req.user;

  const orders = await Order.find({ user: userId }).populate("product");

  if (!orders) {
    throw new CustomError.NotFoundError(
      `No orders for user with id : ${userId}`
    );
  }

  res.status(StatusCodes.OK).json({ orders });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedOrder });
};

const deleteOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Order deleted" });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getCurrentUserOrders,
  updateOrder,
  deleteOrder,
};
