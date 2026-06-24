import Joi from "joi";

export const createAppointmentSchema = Joi.object({
  car: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid car ID format",
      "any.required": "Car ID is required",
    }),

  shop: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid shop ID format",
      "any.required": "Shop ID is required",
    }),

  serviceParts: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.pattern.base": "Invalid part ID format",
        }),
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Service parts must be an array",
      "array.min": "At least one service part is required",
      "any.required": "Service parts are required",
    }),

  scheduledDate: Joi.date().min("now").required().messages({
    "date.base": "Scheduled date must be a valid date",
    "date.min": "Scheduled date cannot be in the past",
    "any.required": "Scheduled date is required",
  }),

  time: Joi.string(),
});

export const editAppointmentSchema = Joi.object({
  car: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid car ID format",
    }),

  shop: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid shop ID format",
    }),

  slot: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid slot ID format",
    }),

  serviceParts: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.pattern.base": "Invalid part ID format",
        }),
    )
    .min(1)
    .messages({
      "array.base": "Service parts must be an array",
      "array.min": "At least one service part is required",
    }),

  scheduledDate: Joi.date().min("now").messages({
    "date.base": "Scheduled date must be a valid date",
    "date.min": "Scheduled date cannot be in the past",
  }),

  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "in-progress",
      "canceled",
      "completed",
      "no-show",
      "rejected",
    )
    .lowercase()
    .messages({
      "any.only":
        "Status must be one of: pending, confirmed, in-progress, canceled, completed, no-show",
    }),

  to: Joi.string(),
}).min(1);
