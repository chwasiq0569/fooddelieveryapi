const router = require("express").Router();
const mongoose = require("mongoose");
const Review = require("../model/Review");
const Restaurant = require("../model/Restaurant");
const Joi = require("@hapi/joi");
const { throughError } = require("../utils");

router.post("/addreview/:restaurantId", async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .trim()
      .min(3)
      .max(30)
      .required()
      .error((errors) => throughError(errors, "Username")),
    message: Joi.string()
      .trim()
      .required()
      .error((errors) => throughError(errors, "Review Message")),
  });

  if (mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
    try {
      await schema.validateAsync({
        username: req.body.username,
        message: req.body.message,
      });

      const restaurant = await Restaurant.findById(req.params.restaurantId);

      if (restaurant) {
        const review = new Review(req.body);
        //added restaurant to food
        review.restaurant = { ...restaurant };
        //saved food
        await review.save();
        //added food to restaurant
        restaurant.reviews.push(review);
        //saved restaurant
        await restaurant.save();

        return res.json({ status: 1, data: review });
      } else {
        return res.json({ status: 0, data: "No Restaurant Found!" });
      }
    } catch (err) {
      return res.json({ status: 0, message: err.message });
    }
  } else {
    return res.json({ status: 0, data: "Invalid Restaurant Id!" });
  }
});

router.get("/", async (req, res) => {
  try {
    const review = await Review.find({});

    return res.json({ status: 1, data: review });
  } catch (err) {
    return res.json({ status: 0, data: err.message });
  }
});

module.exports = router;
