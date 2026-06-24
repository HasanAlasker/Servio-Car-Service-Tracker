import Joi from "joi";

const suggestionValidationSchema = Joi.object({
  title: Joi.string().trim().required().min(3).max(100).messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title must not exceed 100 characters",
    "any.required": "Title is required",
  }),

  message: Joi.string().trim().required().min(10).max(1000).messages({
    "string.empty": "Message is required",
    "string.min": "Message must be at least 10 characters",
    "string.max": "Message must not exceed 1000 characters",
    "any.required": "Message is required",
  }),

  type: Joi.string()
    .required()
    .valid("feature request", "bug report", "improvement", "question", "other")
    .messages({
      "any.only": "Invalid suggestion type",
      "any.required": "Type is required",
    }),
});

export default suggestionValidationSchema;
