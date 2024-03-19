/******** imports and libraries *******/
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

/******** importing routes *******/
const routes = require("./routes/routes");

/********** initialization **********/
const app = express();

/******** defining middlewares *******/
const options = {
  origin: [
    "http://localhost:5173",
    "https://kilimanjaro-express.web.app",
    "https://kilimanjaro-express.firebaseapp.com/",
  ],
};

app.use(cors(options));//options
app.use(helmet());
app.use(bodyParser.json());
// app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  //   sets how the downloads should be handled, either displayed directly or prompting user to save
  //   res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

app.use(routes);

app.post("/callback", (req, res, next) => {
  console.log("am in the callback!")
  console.log(req)
});

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res
    .status(statusCode)
    .json({ success: false, message: message, data: data, error: error });
});

mongoose
  .connect(`${process.env.MONGODB_CONNECTION_STRING}`)
  .then((_) => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server started on port ${process.env.PORT || 8080}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
