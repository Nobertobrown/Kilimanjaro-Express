const Route = require("../../models/Route");

// Edit a route
const updateRoute = (req, res, next) => {
  const id = req.params.routeId;
  const busId = req.params.busId;
  const name = req.body.name;
  const beginning = req.body.beginning;
  const destination = req.body.destination;
  const date = req.body.date;
  const time = req.body.time;
  const cost = req.body.cost;

  Route.findById(id)
    .then((route) => {
      if (!route) {
        const error = new Error("Could not find route.");
        error.statusCode = 404;
        throw error;
      }
      if (route.busId.toString() !== busId) {
        const error = new Error("Not Acceptable!");
        error.statusCode = 406;
        throw error;
      }

      route.name = name;
      route.beginning = beginning;
      route.destination = destination;
      route.date = date;
      route.time = time;
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