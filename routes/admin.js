const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middlewares/isAuth");

const Admin = require("../models/Admin");
const adminController = require("../controllers/admin");

const router = express.Router();

router.route("/signup").post(
  [
    body("email", "Please enter a valid email")
      .trim()
      .isEmail()
      .custom(async (value) => {
        try {
          const admin = await Admin.findOne({ email: value });
          if (admin) {
            throw new Error("Email address already exists!");
          }
          return true;
        } catch (err) {
          console.log(err);
        }
      }),
    body("password", "Please enter a strong password")
      .trim()
      .isLength({ min: 6 }),
    body("confirmPassword", "The passwords entered do not match!")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("The passwords entered do not match!");
        }
        return true;
      })
      .normalizeEmail(),
  ],
  adminController.postSignup
);

router.route("/login").post(adminController.postLogin);

router.route("/create-bus").post(isAuth, adminController.postBus);

router.route("/:busId/edit").put(isAuth, adminController.putBus);

router.route("/:busId/delete").delete(isAuth, adminController.deleteBus);

router.route("/:busId/create-route").post(isAuth, adminController.postRoute);

router.route("/:busId/:routeId/edit").put(isAuth, adminController.updateRoute);

router
  .route("/:busId/:routeId/delete")
  .delete(isAuth, adminController.deleteRoute);

module.exports = router;
