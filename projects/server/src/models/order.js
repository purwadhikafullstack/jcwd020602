module.exports = (sequelize, Sequelize) => {
  const orders = sequelize.define(
    "orders",
    {
      transaction_code: Sequelize.STRING, // pakai nanoid atau tanggal
      payment_proof: Sequelize.STRING,
      status: Sequelize.ENUM(
        "CART",
        "PAYMENT",
        "CONFIRM_PAYMENT",
        "PROCESSING",
        "DELIVERY",
        "CANCELLED",
        "DONE"
      ),
      courier: Sequelize.ENUM("jne", "pos", "tiki"),
      shipping_cost: Sequelize.INTEGER,
      total_price: Sequelize.INTEGER,
      user_id: {
        type: Sequelize.INTEGER,
      },
      address_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      paranoid: true,
    }
  );
  return orders;
};
