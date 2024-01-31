const Route = require("../../models/Route");

// Create a route
const postRoute = (req, res, next) => {
  const busId = req.params.busId;
  const name = req.body.name;
  const origin = req.body.origin;
  const destination = req.body.destination;
  const date = req.body.date;
  const time = req.body.time;
  const duration = req.body.duration;
  const cost = req.body.cost;
  let selectedBus;

  const route = new Route({
    busId: busId,
    name: name,
    origin: origin,
    destination: destination,
    date: date,
    time: time,
    duration: duration,
    cost: cost,
  });

  route
    .save()
    .then((_) => {
      return Bus.findById(busId);
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