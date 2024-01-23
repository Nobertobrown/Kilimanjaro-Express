const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const Bus = require("../models/Bus");
const Route = require("../models/Route");

// Create admin
exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const admin = new Admin({
        email: email,
        password: hashedPw,
      });
      return admin.save();
    })
    .then((result) => {
      res.status(201).json({ message: "Admin created!", adminId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Login as admin
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let authenticatedAdmin;

  Admin.findOne({ email: email })
    .then((admin) => {
      if (!admin) {
        const error = new Error("Wrong e-mail or password!");
        error.statusCode = 401;
        throw error;
      }
      authenticatedAdmin = admin;
      return bcrypt.compare(password, admin.password);
    })
    .then((equal) => {
      if (!equal) {
        const error = new Error("Wrong e-mail or password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: authenticatedAdmin.email,
          adminId: authenticatedAdmin._id.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        adminId: authenticatedAdmin._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Create a bus
exports.postBus = (req, res, next) => {
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

// Edit a bus
exports.putBus = (req, res, next) => {
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

// Delete a bus
exports.deleteBus = (req, res, next) => {
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

// Create a route
exports.postRoute = (req, res, next) => {
  const busId = req.params.busId;
  const name = req.body.name;
  const beginning = req.body.beginning;
  const destination = req.body.destination;
  const date = req.body.date;
  const time = req.body.time;
  const cost = req.body.cost;
  let selectedBus;

  const route = new Route({
    busId: busId,
    name: name,
    beginning: beginning,
    destination: destination,
    date: date,
    time: time,
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

// Edit a route
exports.updateRoute = (req, res, next) => {
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

// Delete a route
exports.deleteRoute = (req, res, next) => {
  const routeId = req.params.routeId;
  const busId = req.params.busId;

  Route.findById(routeId)
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
