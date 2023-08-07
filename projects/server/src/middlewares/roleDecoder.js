const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const {
  CustomError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  BadGatewayError,
  ServiceUnavailableError,
} = require("../utils/customErrors");
const { errorResponse } = require("../utils/function");
const { findToken } = require("../service/user.service");

const roleDecoder = {
  checkUser: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const find = await findToken({ token, valid: 1 });
      if (!find) {
        throw new UnauthorizedError(
          "Token has expired. Please log in again(user)."
        );
      }
      const user = await db.User.findOne({
        where: {
          id: JSON.parse(find?.dataValues?.userId).id,
        },
      });
      if (user.role != "USER") {
        throw new UnauthorizedError(
          "You are not a User and is not authorized to access this feature."
        );
      }
      delete user.dataValues.password;
      req.user = user.dataValues;
      next();
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  checkAdmin: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const find = await findToken({ token, valid: 1 });
      if (!find) {
        throw new UnauthorizedError(
          "Token has expired. Please log in again(staff)."
        );
      }
      const user = await db.User.findOne({
        where: {
          id: JSON.parse(find?.dataValues?.userId).id,
        },
      });
      if (user.role != "ADMIN" && user.role != "SUPERADMIN") {
        throw new UnauthorizedError(
          "You are a staff and is not authorized to access this feature."
        );
      }
      delete user.dataValues.password;
      req.user = user.dataValues;
      next();
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  checkSuper: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const find = await findToken({ token, valid: 1 });

      if (!find) {
        throw new UnauthorizedError(
          "Token has expired. Please log in again(super)."
        );
      }
      const user = await db.User.findOne({
        where: {
          id: JSON.parse(find?.dataValues?.userId).id,
        },
      });
      if (user.role != "SUPERADMIN") {
        throw new UnauthorizedError(
          "You are a staff and is not authorized to access this feature."
        );
      }
      delete user.dataValues.password;
      req.user = user.dataValues;
      next();
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
};

module.exports = roleDecoder;
