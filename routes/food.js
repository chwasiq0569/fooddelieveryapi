const router = require("express").Router();
const mongoose = require("mongoose");
const Food = require("../model/Food");
const Restaurant = require("../model/Restaurant");
const Joi = require("@hapi/joi");
const { throughError } = require("../utils");

router.post("/createfood/:restaurantId", async (req, res) => {
  const schema = Joi.object().keys({
    title: Joi.string()
      .trim()
      .min(3)
      .max(30)
      .required()
      .error((errors) => throughError(errors, "Title Name")),
    image: Joi.string()
      .trim()
      .required()
      .error((errors) => throughError(errors, "Food Image")),
    price: Joi.string()
      .required()
      .error((errors) => throughError(errors, "Food Price")),
  });

  const foodExists = await Food.findOne({
    name: req.body.title,
  });

  if (foodExists)
    return res.json({ status: 0, message: "Food Already Exists!" });

  if (mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
    try {
      await schema.validateAsync({
        title: req.body.title,
        image: req.body.image,
        price: req.body.price,
      });

      const restaurant = await Restaurant.findById(req.params.restaurantId);

      if (restaurant) {
        const food = await new Food(req.body);

        food.restaurant = restaurant;

        await food.save();

        return res.json({ status: 1, data: food });
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

module.exports = router;
