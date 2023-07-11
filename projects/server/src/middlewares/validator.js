const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
});

const loginAdminSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().required(),
});

const addWarehouseSchema = Joi.object({
  name: Joi.string(),
  address: Joi.string(),
  province: Joi.string(),
  city: Joi.string(),
  district: Joi.string(),
});

const editWarehouseSchema = Joi.object({
  name: Joi.string(),
  address: Joi.string(),
  province: Joi.string(),
  city: Joi.string(),
  district: Joi.string(),
});

const verifySchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(/[a-z]/) // At least one lowercase letter
    .pattern(/[A-Z]/) // At least one uppercase letter
    .pattern(/\d/) // At least one digit
    .pattern(/[@$!%*?&]/), // At least one special character
  confirmPassword: Joi.ref("password"),
  token: Joi.string(),
});

const editProfileSchema = Joi.object({
  email: Joi.string().email(),
  fullName: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string()
    .pattern(/^((0)|(\+62))/)
    .min(10)
    .max(14)
    .required()
    .messages({
      "string.pattern.base": '"phoneNumber" must start with "0" or "+62"',
    }),
});

const editPasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .required()
    .pattern(/[a-z]/) // At least one lowercase letter
    .pattern(/[A-Z]/) // At least one uppercase letter
    .pattern(/\d/) // At least one digit
    .pattern(/[@$!%*?&]/), // At least one special character
  confirmPassword: Joi.ref("newPassword"),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      isError: true,
      message: error.details[0].message,
      data: null,
    });
  }

  next();
};

const requestStockSchema = Joi.object({
  from_warehouse_id: Joi.number().integer().required(),
  to_warehouse_id: Joi.number().integer().required(),
  products_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
});

// Export the validator function
module.exports = {
  validateRegister: validate(registerSchema),
  validateVerification: validate(verifySchema),
  validateEditProfile: validate(editProfileSchema),
  validateEditPassword: validate(editPasswordSchema),
  validateRequestStock: validate(requestStockSchema),
  validateLoginAdmin: validate(loginAdminSchema),
  validateAddWarehouse: validate(addWarehouseSchema),
  validateEditWarehouse: validate(editWarehouseSchema),
};
