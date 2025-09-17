const BusRoute = require("../models/BusRoutes");

// 🔎 Search for bus routes containing both start & dest
exports.findRoute = async (req, res) => {
  const { start, dest } = req.query;

  if (!start || !dest) {
    return res.status(400).json({ message: "Please provide start and dest stops" });
  }

  try {
    const routes = await BusRoute.find();
    let matches = [];

    for (const route of routes) {
      const stopNames = route.stops.map(s => s.name.toLowerCase());

      const startIdx = stopNames.findIndex(n => n.includes(start.toLowerCase()));
      const destIdx = stopNames.findIndex(n => n.includes(dest.toLowerCase()));

      // Both stops exist and are not same
      if (startIdx !== -1 && destIdx !== -1 && startIdx !== destIdx) {
        matches.push({
          routeNo: route.busNumber,      // Token / route number
          fullRoute: route.stops,        // All stops (for Google Maps polyline in Flutter)
          startStop: route.stops[startIdx],
          destStop: route.stops[destIdx],
        });
      }
    }

    if (matches.length === 0) {
      return res.status(404).json({ message: "No route found between these stops" });
    }

    res.json(matches);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
