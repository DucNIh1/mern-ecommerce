const devErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stackStrace: err.stack,
    err,
  });
};

const prodErrors = (err, res) => {
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong, please try again.",
    });
  }
};

const errController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    prodErrors(err, res);
  } else if (process.env.NODE_ENV === "development") {
    devErrors(err, res);
  }
};
export default errController;
