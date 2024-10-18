import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    sizes: [
      {
        size: {
          type: String,
          enum: ["s", "m", "l", "xl"],
          required: true,
          lowercase: true,
        },
        //quantity in stock
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    ratingAvg: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    target: {
      type: String,
      enum: ["Nam", "Nữ", "Trẻ em"], // Specify the type
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (!this.isModified("price")) {
    return next();
  }
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(this.price);
  this.price = formattedPrice;

  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
