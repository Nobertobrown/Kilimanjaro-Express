const Route = require("../../models/Route");
const Bus = require("../../models/Bus")

// Create a route
const postRoute = (req, res, next) => {
  const bus = req.params.busId;
  const name = req.body.name;
  const origin = req.body.origin;
  const destination = req.body.destination;
  const departureDate = req.body.departureDate;
  const departureTime = req.body.departureTime;
  const arrivalDate = req.body.arrivalDate;
  const arrivalTime = req.body.arrivalTime;
  const cost = req.body.cost;
  let selectedBus;

  const route = new Route({
    bus: bus,
    name: name,
    origin: origin,
    destination: destination,
    departureDate: departureDate,
    departureTime: departureTime,
    arrivalDate: arrivalDate,
    arrivalTime: arrivalTime,
    cost: cost,
  });

  route
    .save()
    .then((_) => {
      return Bus.findById(bus);
    })
    .then((bus) => {
      selectedBus = bus;
      selectedBus.routes.push(route);
      return selectedBus.save();
    })
    .then((_) => {
      res.status(201).json({
        message: "Route saved successfully!",
        route: route,
        bus: selectedBus.name,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

module.exports = postRoute;