import Joi from "joi";

// Validation for time format (HH:MM)
const timeSchema = Joi.string()
  .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  .messages({
    "string.pattern.base": "Time must be in HH:MM format (e.g., 09:00, 14:30)",
  });

// Valid day codes
const validDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// Validation for a single day's hours
const dayHoursSchema = Joi.object({
  day: Joi.string()
    .valid(...validDays)
    .required()
    .messages({
      "any.only": "Day must be one of: sun, mon, tue, wed, thu, fri, sat",
      "any.required": "Day is required",
    }),
  isOpen: Joi.boolean().required(),
  from: Joi.when("isOpen", {
    is: true,
    then: timeSchema.required(),
    otherwise: Joi.string().allow("", null).optional(),
  }),
  to: Joi.when("isOpen", {
    is: true,
    then: timeSchema.required(),
    otherwise: Joi.string().allow("", null).optional(),
  }),
}).custom((value, helpers) => {
  // Validate that 'from' is before 'to' when open
  if (value.isOpen && value.from && value.to) {
    const [fromH, fromM] = value.from.split(":").map(Number);
    const [toH, toM] = value.to.split(":").map(Number);

    const fromMinutes = fromH * 60 + fromM;
    const toMinutes = toH * 60 + toM;

    if (fromMinutes >= toMinutes) {
      return helpers.error("any.custom", {
        message: "Opening time must be before closing time",
      });
    }
  }
  return value;
});

// Address schema as an object
const addressSchema = Joi.object({
  city: Joi.string().trim().required().messages({
    "string.empty": "City is required",
    "any.required": "City is required",
  }),
  area: Joi.string().trim().required().messages({
    "string.empty": "Area is required",
    "any.required": "Area is required",
  }),
  street: Joi.string().trim().required().messages({
    "string.empty": "Street is required",
    "any.required": "Street is required",
  }),
});

export const addShopSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(25)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      "string.empty": "Shop name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name can't be longer than 25 characters",
      "string.pattern.base": "Please enter a valid name",
      "any.required": "Shop name is required",
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      "string.empty": "Shop description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description can't be longer than 50 characters",
      "string.pattern.base": "Please enter a valid description",
      "any.required": "Shop description is required",
    }),

  image: Joi.string().allow(""),

  imagePublicId: Joi.string().allow(""),

  phone: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
    .required()
    .trim()
    .messages({
      "string.pattern.base": "Please enter a valid phone number",
      "any.required": "Phone number is required",
    }),

  link: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .pattern(
      /^https:\/\/(www\.)?(google\.com\/maps|maps\.google\.com|goo\.gl\/maps|maps\.app\.goo\.gl)/,
    )
    .messages({
      "string.empty": "Shop link is required",
      "string.min": "Link must be at least 5 characters long",
      "string.max": "Link can't be longer than 500 characters",
      "string.pattern.base": "Please enter a Google Maps link",
      "any.required": "Shop link is required",
    }),

  services: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required(),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Services must be an array",
      "array.min": "At least one service is required",
      "any.required": "Services are required",
    }),

  address: addressSchema.required().messages({
    "any.required": "Address is required",
  }),

  openHours: Joi.array()
    .items(dayHoursSchema)
    .length(7)
    .required()
    .custom((value, helpers) => {
      // Ensure all 7 days are present and no duplicates
      const days = value.map((item) => item.day);
      const uniqueDays = new Set(days);

      if (uniqueDays.size !== 7) {
        return helpers.error("any.custom", {
          message: "All 7 days must be provided without duplicates",
        });
      }

      // Check if all required days are present
      const hasAllDays = validDays.every((day) => days.includes(day));
      if (!hasAllDays) {
        return helpers.error("any.custom", {
          message: "All days of the week must be included",
        });
      }

      return value;
    })
    .messages({
      "array.base": "Open hours must be an array",
      "array.length": "Open hours must contain exactly 7 days",
      "any.required": "Open hours are required",
    }),

  lng: Joi.string().required(),
  lat: Joi.string().required(),
});

export const editShopSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(25)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      "string.empty": "Shop name cannot be empty",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name can't be longer than 25 characters",
      "string.pattern.base": "Please enter a valid name",
    }),

  image: Joi.string().allow(""),

  imagePublicId: Joi.string().allow(""),

  description: Joi.string()
    .trim()
    .min(10)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      "string.empty": "Shop description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description can't be longer than 50 characters",
      "string.pattern.base": "Please enter a valid description",
      "any.required": "Shop description is required",
    }),

  phone: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
    .required()
    .trim()
    .messages({
      "string.pattern.base": "Please enter a valid phone number",
      "any.required": "Phone number is required",
    }),

  link: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "Shop link is required",
    "string.min": "Link must be at least 5 characters long",
    "string.max": "Link can't be longer than 500 characters",
    "any.required": "Shop link is required",
  }),

  lng: Joi.string().required(),
  lat: Joi.string().required(),

  services: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required(),
      }),
    )
    .min(1)
    .messages({
      "array.base": "Services must be an array",
      "array.min": "At least one service is required",
    }),

  address: addressSchema,

  openHours: Joi.array()
    .items(dayHoursSchema)
    .length(7)
    .custom((value, helpers) => {
      // Ensure all 7 days are present and no duplicates
      const days = value.map((item) => item.day);
      const uniqueDays = new Set(days);

      if (uniqueDays.size !== 7) {
        return helpers.error("any.custom", {
          message: "All 7 days must be provided without duplicates",
        });
      }

      const hasAllDays = validDays.every((day) => days.includes(day));
      if (!hasAllDays) {
        return helpers.error("any.custom", {
          message: "All days of the week must be included",
        });
      }

      return value;
    })
    .messages({
      "array.base": "Open hours must be an array",
      "array.length": "Open hours must contain exactly 7 days",
    }),
}).min(1);
