const Reservation = require("../../models/Reservation");

const fetchReservations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const reservations = await Reservation.find()
      .populate(
        "route",
        "name origin destination arrivalDate departureDate departureTime arrivalTime -_id"
      )
      .skip(skip)
      .limit(limit);

    if (reservations.length === 0) {
      return res.status(404).json({ success: false, error: "No reservations found!" });
    }

    return res.status(200).json({ success: true, reservations });
  } catch (error) {
    console.error("Error fetching reservations", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = fetchReservations;
