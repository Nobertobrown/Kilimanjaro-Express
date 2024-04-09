const Reservation = require("../../models/Reservation");
const Route = require("../../models/Route");
const mobilePay = require("../payment/makeMobilePayment");

// Make reservation
const postReservation = async (req, res, next) => {
  const route = req.body.routeId;
  const customers =  [...req.body.customers] ;
  const phoneNo = req.body.phoneNo;
  const totalFare = req.body.amount;
  const desc = req.body.description;
  const provider = req.body.provider;
  let selectedRoute;

  const result = await mobilePay({
    mno: provider,
    phoneNo: phoneNo,
    amount: totalFare,
  });

  // Checks if the result is an error
  if (result.hasOwnProperty("statusCode")) {
    return next(result);
  }

  if (result.success) {
    const transId = result.transactionId;

    const reservation = new Reservation({
      route: route,
      customers: customers,
      phoneNo: phoneNo,
      fare: totalFare,
      transactionId: transId,
      description: desc,
    });

    reservation
      .save()
      .then((_) => {
        return Route.findById(route);
      })
      .then((route) => {
        selectedRoute = route;
        selectedRoute.reservations.push(reservation);
        return selectedRoute.save();
      })
      .then((_) => {
        res.status(201).json({
          message: "Reservation saved successfully!",
          reservation: reservation,
          route: selectedRoute.name,
          success: true,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } else {
    res.status(400).json({ success: false, message: "Transaction failed!" });
  }
};

module.exports = postReservation;
