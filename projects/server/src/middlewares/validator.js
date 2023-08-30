const Joi = require("joi");

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
//-----------------------------------------------------USER
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/[a-z]/) // At least one lowercase letter
    .pattern(/[A-Z]/) // At least one uppercase letter
    .pattern(/\d/), // At least one digit
  // .pattern(/[@$!%*?&]/), // At least one special character,
});

const verifySchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^((0)|(\+62))/)
    .min(10)
    .max(12)
    .required()
    .messages({
      "string.pattern.base": "phone must start with 0 or +62",
    }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(/[a-z]/) // At least one lowercase letter
    .pattern(/[A-Z]/) // At least one uppercase letter
    .pattern(/\d/), // At least one digit
  confirmPassword: Joi.string().required(),
});

const editProfileSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^((0)|(\+62))/)
    .min(10)
    .max(12)
    .required()
    .messages({
      "string.pattern.base": "phone must start with 0 or +62",
    }),
});

const editPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string()
    .min(8)
    .required()
    .pattern(/[a-z]/) // At least one lowercase letter
    .pattern(/[A-Z]/) // At least one uppercase letter
    .pattern(/\d/), // At least one digit
  oldPassword: Joi.string()
    .min(8)
    .required()
    .pattern(/[a-z]/) // At least one lowercase letter
    .pattern(/[A-Z]/) // At least one uppercase letter
    .pattern(/\d/), // At least one digit
});
const forgotPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .required()
    .pattern(/[a-z]/) // At least one lowercase letter
    .pattern(/[A-Z]/) // At least one uppercase letter
    .pattern(/\d/), // At least one digit
});
//-----------------------------------------------------WAREHOUSE

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

const stockSchema = Joi.object({
  stock: Joi.number().integer().min(1).required(),
  shoe_id: Joi.number().integer().required(),
  shoe_size_id: Joi.number().integer().required(),
  warehouse_id: Joi.number().integer().required(),
});

const editStockSchema = Joi.object({
  stock: Joi.number().integer().min(1).required(),
});

const stockMutationSchema = Joi.object({
  to_warehouse_id: Joi.number().integer().required(),
  qty: Joi.number().integer().min(1).required(),
  stock_id: Joi.number().integer().required(),
});

// const editStockMutationSchema = Joi.object({
//   stock: Joi.number().integer().min(1).required(),
// });

// Export the validator function
module.exports = {
  validateRegister: validate(registerSchema),
  validateVerification: validate(verifySchema),
  validateEditProfile: validate(editProfileSchema),
  validateEditPassword: validate(editPasswordSchema),
  validateStockMutation: validate(stockMutationSchema),
  validateStock: validate(stockSchema),
  validateEditStock: validate(editStockSchema),
  validateLogin: validate(loginSchema),
  validateAddWarehouse: validate(addWarehouseSchema),
  validateEditWarehouse: validate(editWarehouseSchema),
  validateForgotPass: validate(forgotPasswordSchema),
};
