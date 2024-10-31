import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: {
      type: String,
      enum: ["s", "m", "l", "xl"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  let totalPrice = 0;

  // Kiểm tra nếu có item trong giỏ hàng
  if (this.items && this.items.length > 0) {
    // Tính tổng giá cho mỗi item
    totalPrice = this.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  }

  this.totalPrice = totalPrice;

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
