import Joi from "joi";

export const createReport = Joi.object({
  reason: Joi.string().min(3).max(500).required().messages({
    "string.min": "Reason must be at least 3 characters long",
    "string.max": "Reason cannot exceed 500 characters",
    "any.required": "Reason is required",
  }),
})