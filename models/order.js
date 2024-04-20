const mongoose = require("mongoose");

const SingleOrderItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0.0,
    },
    subTotal: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    cartItems: [SingleOrderItemsSchema],
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: [
        {
          values: [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ],
          message: "{VALUE} is not supported. Please select available status",
        },
      ],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      //   required: true,
    },
    // paymentInfo: {
    //     type: Object,
    //     required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
