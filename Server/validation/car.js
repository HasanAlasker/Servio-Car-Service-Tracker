import Joi from "joi";

export const addCarSchema = Joi.object({
  make: Joi.string().trim().required().messages({
    "string.empty": "Car make is required",
    "any.required": "Car make is required",
  }),

  name: Joi.string().trim().required().messages({
    "string.empty": "Car model name is required",
    "any.required": "Car model name is required",
  }),

  image: Joi.string().allow(""),

  imagePublicId: Joi.string().allow(""),

  model: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      "number.base": "Year must be a number",
      "number.min": "Year must be 1900 or later",
      "number.max": "Year cannot be in the future",
      "any.required": "Year is required",
    }),

  color: Joi.string().trim(),

  plateNumber: Joi.string().trim().required().messages({
    "string.empty": "Plate number is required",
    "any.required": "Plate number is required",
  }),

  mileage: Joi.number().min(0).required().messages({
    "number.base": "Mileage must be a number",
    "number.min": "Mileage cannot be negative",
    "any.required": "Mileage is required",
  }),

  unit: Joi.string().required().valid("km", "mile").messages({
    "any.only": "Invalid unit type",
    "any.required": "Unit is required",
  }),
});

export const editCarSchema = Joi.object({
  make: Joi.string().trim().messages({
    "string.empty": "Car make cannot be empty",
  }),

  name: Joi.string().trim().messages({
    "string.empty": "Car model name cannot be empty",
  }),

  image: Joi.string().allow(""),

  imagePublicId: Joi.string().allow(""),

  model: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .messages({
      "number.base": "Year must be a number",
      "number.min": "Year must be 1900 or later",
      "number.max": "Year cannot be in the future",
    }),

  color: Joi.string().trim(),

  plateNumber: Joi.string().trim().messages({
    "string.empty": "Plate number cannot be empty",
  }),

  mileage: Joi.number().min(0).messages({
    "number.base": "Mileage must be a number",
    "number.min": "Mileage cannot be negative",
  }),

  unit: Joi.string().required().valid("km", "mile").messages({
    "any.only": "Invalid unit type",
    "any.required": "Unit is required",
  }),
}).min(1); // At least one field must be provided for update
