import usersRouter from "./user.route.js";
import productRouter from "./product.route.js";
import uploadRouter from "./upload.route.js";
import categoryRouter from "./category.route.js";
import cartRouter from "./cart.route.js";
import paymentRouter from "./payment.route.js";
import orderRouter from "./order.route.js";

export default function mainRouter(app) {
  app.use("/api/users", usersRouter);
  app.use("/api/products", productRouter);
  app.use("/api/uploads", uploadRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/orders", orderRouter);
}
