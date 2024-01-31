const Reservation = require("../../models/Reservation")
const Route = require("../../models/Route")

// Make reservation
const postReservation = (req, res, next) => {
  const routeId = req.params.routeId;
  const customers = [...req.body.customers];
  const phoneNo = req.body.phoneNo;
  const email = req.body.email;
  const pickup = req.body.pickup;
  let selectedRoute;

  const reservation = new Reservation({
    routeId: routeId,
    customers: customers,
    phoneNo: phoneNo,
    email: email,
    pickup: pickup,
  });

  reservation
    .save()
    .then((_) => {
      return Route.findById(routeId);
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
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = postReservation;