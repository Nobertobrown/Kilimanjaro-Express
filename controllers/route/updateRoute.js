const Route = require("../../models/Route");

// Edit a route
const updateRoute = (req, res, next) => {
  const id = req.params.routeId;
  const bus = req.params.busId;
  const name = req.body.name;
  const origin = req.body.origin;
  const destination = req.body.destination;
  const departureDate = req.body.departureDate;
  const departureTime = req.body.departureTime;
  const arrivalTime = req.body.arrivalTime;
  const arrivalDate = req.body.arrivalDate;
  const cost = req.body.cost;

  Route.findById(id)
    .then((route) => {
      if (!route) {
        const error = new Error("Could not find route.");
        error.statusCode = 404;
        throw error;
      }
      if (route.bus.toString() !== bus) {
        const error = new Error("Not Acceptable!");
        error.statusCode = 406;
        throw error;
      }

      route.name = name;
      route.origin = origin;
      route.destination = destination;
      route.departureDate = departureDate;
      route.departureTime = departureTime;
      route.arrivalDate = arrivalDate;
      route.arrivalTime = arrivalTime;
      route.cost = cost;
      return route.save();
    })
    .then((r) => {
      res.status(200).json({ message: "Route updated!", route: r });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = updateRoute;