const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
//The order of middleware in stack is defined by the order they are defined in the code
app.use(bodyParser.json({ limit: "40mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "40mb" }));
app.use(cors());
if (process.env.NODE_ENV === "dev") {
  //3RD-party MIDDLE WARE - HTTP request logger middleware
  app.use(morgan("dev"));
}

//using express.json middleware -> stand between req and response
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log("request Time:", req.requestTime);
  next();
});

//method 3: mouting the router on a route
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const ratingRouter = require("./routes/rating");
const subimgRouter = require("./routes/subimg");
const featureRouter = require("./routes/feature");
const brandRouter = require("./routes/brand");
const categoryRouter = require("./routes/category");
// const uploadRouter = require("./routes/upload");
const userRouter = require("./routes/user");
// app.use("/api", tourRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/rating", ratingRouter);
app.use("/api/v1/subimg", subimgRouter);
app.use("/api/v1/feature", featureRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/category", categoryRouter);
// app.use("/api/v1/upload", uploadRouter);

module.exports = app;
