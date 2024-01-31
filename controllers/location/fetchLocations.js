const Location = require("../../models/Location");

const fetchLocations = async (req, res, next) => {
  try {
    const locations = await Location.find();
    if (!locations || locations.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No location found!" });
    }

    res.status(200).json({ success: true, locations });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = fetchLocations;
