const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  postRoute,
  fetchRoutes,
  fetchLocations,
  postBus,
  updateRoute,
  deleteRoute,
  putBus,
  deleteBus,
  postReservation,
  deleteReservation,
  makeMobilePayment,
  makeBankPayment,
} = require("../controllers/controllers");
const Admin = require("../models/Admin");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/location", fetchLocations);
router.get("/route", fetchRoutes);
router.route("/:routeId/reservation").post(postReservation);
router.route("/:routeId/:reservationId/delete").delete(deleteReservation);
router.route("/mobile-pay").post(makeMobilePayment);
router.route("/bank-pay").post(makeBankPayment);
router.route("/create-bus").post(isAuth, postBus);
router.route("/:busId/edit").put(isAuth, putBus);
router.route("/:busId/delete").delete(isAuth, deleteBus);
router.route("/:busId/create-route").post(isAuth, postRoute);
router.route("/:busId/:routeId/edit").put(isAuth, updateRoute);
router.route("/:busId/:routeId/delete").delete(isAuth, deleteRoute);

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
  register
);

router.route("/login").post(login);

module.exports = router;