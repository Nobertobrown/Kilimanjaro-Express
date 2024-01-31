const Bus = require("../../models/Bus");

// Edit a bus
const putBus = (req, res, next) => {
  const id = req.params.busId;
  const busName = req.body.name;
  const plateNo = req.body.plate;
  const seats = req.body.seats;
  const type = req.body.type;

  Bus.findByIdAndUpdate(id, {
    name: busName,
    plateNo: plateNo,
    seats: seats,
    type: type,
  })
    .then((bus) => {
      if (!bus) {
        const error = new Error("Bus wasn't found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "The bus has been updated!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = putBus;