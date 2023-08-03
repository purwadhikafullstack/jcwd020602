const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

const getByToken = async (req, res, next) => {
  try {
    // console.log(req.body);
    const token = req.headers.authorization;

    console.log(token);
    let p = await db.Token.findOne({
      where: {
        token,
        expired: {
          [db.Sequelize.Op.gte]: moment().format(),
        },
        valid: true,
      },
    });

    if (!p) {
      throw new Error("token has expired");
    }
    console.log(p.dataValues);
    let user = await db.User.findOne({
      where: {
        id: JSON.parse(p.dataValues.userId).id,
      },
    });
    //id,email,nama,password,dll

    delete user.dataValues.password;

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err.message });
  }
};

module.exports = getByToken;
