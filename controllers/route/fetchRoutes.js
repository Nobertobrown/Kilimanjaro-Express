const { Route } = require("../../models/Route");

const fetchRoutes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const mainQuery = {};

    // Exclude 'page' from the main query
    if (Object.keys(req.query).length >= 1) {
      for (const key in req.query) {
        if (key !== "page") {
          mainQuery[key] = req.query[key];
        }
      }
    }

    const routes = await Route.find(mainQuery).skip(skip).limit(limit);

    if (routes.length === 0) {
      return res.status(404).json({ success: false, error: "No routes found!" });
    }

    return res.status(200).json({ success: true, routes });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = fetchRoutes;
