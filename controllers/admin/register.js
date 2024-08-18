const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");

// Create admin
const postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const admin = new Admin({
        username: username,
        email: email,
        password: hashedPw,
      });
      return admin.save();
    })
    .then((result) => {
      res.status(201).json({ message: "Admin created!", adminId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = postSignup;
