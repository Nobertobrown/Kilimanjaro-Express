const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  postRoute,
  fetchRoutes,
  updateRoute,
  deleteRoute,
  getBuses,
  postBus,
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

router.route("/:routeId/reservation").post(postReservation);
router.route("/:routeId/:reservationId/delete").delete(deleteReservation);
router.route("/mobile-pay").post(makeMobilePayment);
router.route("/bank-pay").post(makeBankPayment);
router.route("/create-bus").post( postBus);//isAuth,
router.route("/buses").get( getBuses);//isAuth,
router.route("/:busId/edit").put( putBus);//isAuth,
router.route("/:busId/delete").delete( deleteBus);//isAuth,
router.route("/:busId/create-route").post( postRoute);//isAuth,
router.get("/routes", fetchRoutes);
router.route("/:busId/:routeId/edit").put( updateRoute);//isAuth,
router.route("/:busId/:routeId/delete").delete( deleteRoute);//isAuth,

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
