module.exports = (sequelize, Sequelize) => {
  const orders = sequelize.define(
    "orders",
    {
      transaction_code: Sequelize.STRING,
      payment_proof: Sequelize.STRING,
      status: Sequelize.ENUM(
        "PAYMENT",
        "CONFIRM_PAYMENT",
        "CANCELED",
        "PROCESSING",
        "DELIVERY",
        "DONE"
      ),
      courier: Sequelize.ENUM("jne", "pos", "tiki"),
      shipping_service: Sequelize.STRING,
      shipping_method: Sequelize.STRING,
      shipping_cost: Sequelize.INTEGER,
      shipping_duration: Sequelize.STRING,
      total_price: Sequelize.INTEGER,
      user_id: {
        type: Sequelize.INTEGER,
      },
      address_id: {
        type: Sequelize.INTEGER,
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
      },
      last_payment_date: Sequelize.DATE,
    },
    {
      paranoid: true,
    }
  );
  return orders;
};
