const Bus = require("../../models/Bus");

// Delete a bus
const deleteBus = (req, res, next) => {
  const busId = req.params.busId;

  Bus.findById(busId)
    .then((bus) => {
      if (bus.routes.length !== 0) {
        const error = new Error("All routes must be deleted first!");
        error.statusCode = 406;
        throw error;
      }

      return Bus.findByIdAndDelete(busId);
    })
    .then((bus) => {
      if (!bus) {
        const error = new Error("Bus wasn't found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "The bus has been deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = deleteBus;