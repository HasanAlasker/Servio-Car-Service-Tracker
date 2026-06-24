import Joi from "joi";

export const earlyAccessSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(255)
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({
      "string.min": "Email must be at least 5 characters long",
      "string.max": "Email can't be longer than 255 characters",
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),

  // phone: Joi.string()
  //   .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
  //   .required()
  //   .trim()
  //   .messages({
  //     "string.pattern.base": "Please enter a valid phone number",
  //     "any.required": "Phone number is required",
  //   }),

  platform: Joi.string().required().valid("android", "ios").messages({
    "any.only": "Invalid platform type",
    "any.required": "Platform is required",
  }),
});
