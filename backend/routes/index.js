import usersRouter from "./user.route.js";
import productRouter from "./product.route.js";
import uploadRouter from "./upload.route.js";
import categoryRouter from "./category.route.js";

export default function mainRouter(app) {
  app.use("/api/users", usersRouter);
  app.use("/api/products", productRouter);
  app.use("/api/uploads", uploadRouter);
  app.use("/api/category", categoryRouter);
}
