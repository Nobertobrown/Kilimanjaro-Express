const Route = require("../../models/Route");
const Bus = require("../../models/Bus");

const fetchRoutes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 50;
    const skip = (page - 1) * perPage;

    let mainQuery = {};
    // Exclude 'page','amenities' & 'categories' from the main query
    if (Object.keys(req.query).length >= 1) {
      for (const key in req.query) {
        if (key !== "page" && key !== "amenities" && key !== "categories") {
          mainQuery[key] = req.query[key];
        }
      }
    }

    if (req.query.amenities || req.query.categories) {
      let busQuery = {};
      if (req.query.amenities) {
        busQuery.amenities = { $in: req.query.amenities };
      }
      if (req.query.categories) {
        busQuery.categories = { $in: req.query.categories };
      }

      const buses = await Bus.find(busQuery);
      const busIds = buses.map((bus) => bus._id);

      // If no buses match the criteria, return empty routes
      if (busIds.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "No routes found!" });
      }

      mainQuery.bus = { $in: busIds };
    }
    
    const routes = await Route.find(mainQuery)
      .populate("bus", "name seats amenities categories -_id") // Populate required fields
      .skip(skip)
      .limit(perPage);

    if (routes.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No routes found!" });
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
