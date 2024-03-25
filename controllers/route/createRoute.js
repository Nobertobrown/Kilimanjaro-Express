const Route = require("../../models/Route");
const Bus = require("../../models/Bus");

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
  let seatInfos;
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

  Bus.findById(bus)
    .then((bus) => {
      selectedBus = bus;
      seatInfos = {
        "1st": [...Array(Math.floor(bus.seats / 4))].map((_, i) => {
          return {
            seatNo: `${String.fromCharCode(65 + i)}3`,
            isBooked: false,
            isSelected: false,
            price: cost,
          };
        }),
        "2nd": [...Array(Math.floor(bus.seats / 4))].map((_, i) => {
          return {
            seatNo: `${String.fromCharCode(65 + i)}4`,
            isBooked: false,
            isSelected: false,
            price: cost,
          };
        }),
        "3rd": [
          {
            seatNo: `${String.fromCharCode(
              65 + Math.floor(bus.seats / 4 - 1)
            )}5`,
            isBooked: false,
            isSelected: false,
            price: cost,
          },
        ],
        "4th": [...Array(Math.floor(bus.seats / 4))].map((_, i) => {
          return {
            seatNo: `${String.fromCharCode(65 + i)}2`,
            isBooked: false,
            isSelected: false,
            price: cost,
          };
        }),
        "5th": [...Array(Math.floor(bus.seats / 4))].map((_, i) => {
          return {
            seatNo: `${String.fromCharCode(65 + i)}1`,
            isBooked: false,
            isSelected: false,
            price: cost,
          };
        }),
      };
      route.seatInfos = seatInfos;
      return route.save();
    })
    .then(() => {
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
