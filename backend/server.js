import express from "express";
import conn from "./db/config.js";
import errController from "./controllers/error.controller.js";
import cookieParser from "cookie-parser";
import mainRouter from "./routes/index.js";
import AppError from "./utils/AppError.js";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
//Connect to DB
conn();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve(); // lấy ra thư mục gốc
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mainRouter(app);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(errController);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
