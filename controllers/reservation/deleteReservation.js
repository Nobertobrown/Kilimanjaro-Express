const Reservation = require("../../models/Reservation");

// Cancel reservation
const deleteReservation = (req, res, next) => {
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

module.exports = deleteReservation;