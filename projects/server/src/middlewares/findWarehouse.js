const db = require("../models");
const haversine = require("haversine");

const findClosestWarehouse = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const address = await db.Address.findOne({
      where: { user_id, is_primary: true },
    });
    if (!address) {
      return res.status(404).send({ message: "User address not found" });
    }
    const warehouse = await db.Warehouse.findAll();

    let closestWarehouse = null;
    let shortestDistance = Number.MAX_SAFE_INTEGER;

    warehouse.forEach((warehouse) => {
      const distance = haversine(address, {
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
      });
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestWarehouse = warehouse;
      }
    });

    req.closestWarehouse = closestWarehouse;
    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
module.exports = findClosestWarehouse;
