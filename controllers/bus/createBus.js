const Bus = require("../../models/Bus");

// Create a bus
const postBus = (req, res, next) => {
  const busName = req.body.name;
  const plateNo = req.body.plate;
  const seats = req.body.seats;
  const type = req.body.type;

  const bus = new Bus({
    name: busName,
    plateNo: plateNo,
    seats: seats,
    type: type,
  });

  bus
    .save()
    .then((newBus) => {
      res.status(201).json({
        message: "Bus created!",
        bus: newBus,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = postBus;