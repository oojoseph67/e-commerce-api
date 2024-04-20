const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide product rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide product comment"],
      maxLength: [100, "Product comment cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "Please provide product comment"],
      maxLength: [1000, "Product comment cannot exceed 1000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamp: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const obj = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Product").findByIdAndUpdate(productId, {
      averageRating: Math.ceil(obj[0]?.averageRating),
      numOfReviews: obj[0]?.numOfReviews,
    });
  } catch (error) {
    console.error(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
  console.log("Review saved");
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
  console.log("Review removed");
});

module.exports = mongoose.model("Review", ReviewSchema);
