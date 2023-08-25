const db = require("../models");
const moment = require("moment");
const { errorResponse } = require("../utils/function");
const { CustomError } = require("../utils/customErrors");
const { countAndSum } = require("../service/salesReport.service");
const { getWarehouseForSales } = require("../service/warehouse.service");

const salesReportCotroller = {
  getSalesReport: async (req, res) => {
    try {
      const warehouse = await getWarehouseForSales({
        id: req.query?.warehouse_id || req?.user?.warehouse_id,
      });
      const data = await countAndSum({
        warehouse_id: warehouse[0]?.dataValues?.id,
        search: req.query?.search || "",
        brand_id: req.query?.brand_id,
        category_id: req.query?.category_id,
        subcategory_id: req.query?.subcategory_id,
        shoe_id: req.query?.shoe_id,
        timeFrom: req.query?.timeFrom,
        timeTo: req.query?.timeTo,
      });
      res.status(200).send(data);
    } catch (err) {
      errorResponse(res, err, CustomError);
    }
  },
};
module.exports = salesReportCotroller;
