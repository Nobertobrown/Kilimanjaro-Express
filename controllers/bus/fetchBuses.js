const Bus = require("../../models/Bus");

const fetchBuses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const buses = await Bus.find().skip(skip).limit(limit);

    if (buses.length === 0) {
      return res.status(404).json({ success: false, error: "No buses found!" });
    }

    return res.status(200).json({ success: true, buses });
  } catch (error) {
    console.error("Error fetching buses", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = fetchBuses;
