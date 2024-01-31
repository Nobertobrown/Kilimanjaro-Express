const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");

// Login as admin
const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let authenticatedAdmin;

  Admin.findOne({ email: email })
    .then((admin) => {
      if (!admin) {
        const error = new Error("Wrong e-mail or password!");
        error.statusCode = 401;
        throw error;
      }
      authenticatedAdmin = admin;
      return bcrypt.compare(password, admin.password);
    })
    .then((equal) => {
      if (!equal) {
        const error = new Error("Wrong e-mail or password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: authenticatedAdmin.email,
          adminId: authenticatedAdmin._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        adminId: authenticatedAdmin._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = postLogin;