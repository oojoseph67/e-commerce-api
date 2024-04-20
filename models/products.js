const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxLength: [1000, "Product description cannot exceed 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads.example.jpeg",
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: {
        values: [
          "Electronics",
          "Cameras",
          "Laptops",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Clothes/Shoes",
          "Beauty/Health",
          "Sports",
          "Outdoor",
          "Home",
        ],
        message:
          "{VALUE is not supported. Please select correct category for product",
      },
    },
    company: {
      type: String,
      required: [true, "Please provide product company"],
      enum: {
        values: [
          "Apple",
          "Samsung",
          "Microsoft",
          "Lenovo",
          "ASUS",
          "DELL",
          "HP",
          "Logitech",
          "Amazon",
          "Nokia",
          "Sony",
          "Canon",
          "Nikon",
          "Bose",
        ],
        message:
          "{VALUE is not supported. Please select verified company for product",
      },
    },
    colors: {
      type: [String],
      required: true,
      default: ["White"],
      enum: {
        values: [
          "Black",
          "Brown",
          "Silver",
          "White",
          "Blue",
          "Red",
          "Green",
          "Yellow",
          "Gold",
          "Purple",
          "Pink",
        ],
        message:
          "{VALUE is not supported. Please select available colors for product",
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 1,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

module.exports = mongoose.model("Product", ProductSchema);
