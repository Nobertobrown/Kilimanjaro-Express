const Bus = require("../../models/Bus");
const Route = require("../../models/Route");

// Delete a route
const deleteRoute = (req, res, next) => {
  const routeId = req.params.routeId;
  const busId = req.params.busId;

  Route.findById(routeId)
    .then((route) => {
      if (!route) {
        const error = new Error("Could not find route.");
        error.statusCode = 404;
        throw error;
      }
      if (route.bus.toString() !== busId) {
        const error = new Error("Not Acceptable!");
        error.statusCode = 406;
        throw error;
      }
      if (route.reservations.length !== 0) {
        const error = new Error("All reservations must be deleted first!");
        error.statusCode = 406;
        throw error;
      }

      return Route.findByIdAndDelete(routeId);
    })
    .then((_) => {
      return Bus.findById(busId);
    })
    .then((bus) => {
      bus.routes.pull(routeId);
      return bus.save();
    })
    .then((_) => {
      res.status(200).json({ message: "The route has been deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = deleteRoute;