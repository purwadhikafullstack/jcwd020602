const db = require("../models");
module.exports = {
  findAllOrderDetail: async (body) => {
    try {
      return await db.OrderDetail.findAll({
        where: { order_id: body?.order_id },
        include: [{ model: db.Stock, include: { model: db.Warehouse } }],
      });
    } catch (error) {
      return error;
    }
  },
};
