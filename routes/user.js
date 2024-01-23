const express = require("express");

const userController = require("../controllers/user");

const paymentController = require("../controllers/payment")

const router = express.Router();

router.route("/:routeId/reservation").post(userController.postReservation);

router
  .route("/:routeId/:reservationId/delete")
  .delete(userController.deleteReservation);

router.route("/mobile-pay").post(paymentController.postMobilePayments);

router.route("/bank-pay").post(paymentController.postBankPayments);

module.exports = router;
