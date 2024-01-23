const Africastalking = require("africastalking")({
  apiKey: process.env.AFRICAS_TALKING_API, // use your sandbox app API key for development in the test environment
  username: "sandbox", // use 'sandbox' for development in the test environment
});

const Reservation = require("../models/Reservation");
const Route = require("../models/Route");

// Initialize a service e.g. SMS
const sms = Africastalking.SMS;

// Make reservation
exports.postReservation = (req, res, next) => {
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

// Cancel reservation
exports.deleteReservation = (req, res, next) => {
  const routeId = req.params.routeId;
  const reservationId = req.params.reservationId;

  Reservation.findById(reservationId)
    .then((reservation) => {
      if (!reservation) {
        const error = new Error("Could not find reservation.");
        error.statusCode = 404;
        throw error;
      }
      if (reservation.routeId.toString() !== routeId) {
        const error = new Error("Not Acceptable!");
        error.statusCode = 406;
        throw error;
      }

      return Reservation.findByIdAndDelete(reservationId);
    })
    .then((_) => {
      res.status(200).json({ message: "The reservation has been deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// TODO: Create and send ticket throught SMS
exports.sendTickets = (req, res) => {
  const sendSms = async () => {
    const options = {
      to: ["+255748281617"],
      message:
        "The current temperature is " +
        temperature +
        "degrees Celcius, it is " +
        description,
    };
    const res = await sms.send(options);
    console.log(res);
  };

  sendSms();
};