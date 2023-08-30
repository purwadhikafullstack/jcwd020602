const db = require("../models");
module.exports = {
  findAllOrderDetail: async (body) => {
    try {
      return await db.OrderDetail.findAll({
        where: { order_id: body?.order_id },
        include: [
          {
            model: db.Stock,
            paranoid: false,
            include: { model: db.Warehouse, paranoid: false },
          },
        ],
      });
    } catch (error) {
      return error;
    }
  },
  addOrderDetails: async (body) => {
    try {
      return await db.OrderDetail.create(
        {
          qty: body?.qty,
          price: body?.price,
          stock_id: body?.stock_id,
          order_id: body?.order_id,
        },
        { transaction: body?.t }
      );
    } catch (err) {
      return err;
    }
  },
};
