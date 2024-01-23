/******** imports and libraries *******/
// const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

/******** importing routes *******/
const adminRoutes = require("./routes/admin")
const userRoutes = require("./routes/user")

/********** initialization **********/
const app = express();

/******** defining middlewares *******/
app.use(bodyParser.json());
// app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  //   sets how the downloads should be handled, either displayed directly or prompting user to save
  //   res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

// app.use("/catalogue", catalogueRoutes);
app.use(userRoutes);
app.use("/admin", adminRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({ message: message, data: data, error: error });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/kilimanjaro")
  .then((res) => {
    app.listen(8080, () => {
      console.log("Server started on port 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
