const Joi = require("joi");

const categories = [
  "Beach", "Hills", "Desert", "Historic", "Culture", "Adventure",
  "Wildlife", "City", "Rural", "Winter", "Wellness", "Food", "Cruise",
  "Festivals", "Luxury", "Budget", "Road Trips"
];

module.exports.listingSchema = Joi.object({
  Listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow("", null)
    }),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string().valid(...categories).required() // ✅ New validation
  }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required(),
});