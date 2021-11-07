const router = require("express").Router();
const mongoose = require("mongoose");
const Food = require("../model/Food");
const Restaurant = require("../model/Restaurant");
const Joi = require("@hapi/joi");
const { throughError } = require("../utils");
const bodyParser = require("body-parser");

router.post("/createfood/:restaurantId", async (req, res) => {
  const schema = Joi.object().keys({
    title: Joi.string()
      .trim()
      .min(3)
      .max(30)
      .required()
      .error((errors) => throughError(errors, "Food Title")),
    image: Joi.string()
      .trim()
      .required()
      .error((errors) => throughError(errors, "Food Image")),
    price: Joi.string()
      .required()
      .error((errors) => throughError(errors, "Food Price")),
  });

  if (mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
    try {
      await schema.validateAsync({
        title: req.body.title,
        image: req.body.image,
        price: req.body.price,
      });

      const foodExists = await Food.findOne({
        title: req.body.title,
      });

      if (foodExists)
        return res.json({ status: 0, message: "Food Already Exists!" });
      else {
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (restaurant) {
          const food = new Food(req.body);
          // //added restaurant to food
          food.restaurant = { ...restaurant };
          // //saved food
          await food.save();
          // //added food to restaurant
          await restaurant.foods.push(food);
          // //saved restaurant
          await restaurant.save();

          return res.json({ status: 1, data: food });
        } else {
          return res.json({ status: 0, data: "No Restaurant Found!" });
        }
      }
    } catch (err) {
      console.log("ERR", err);
      return res.json({ status: 0, message: err.message });
    }
  } else {
    return res.json({ status: 0, data: "Invalid Restaurant Id!" });
  }
});

router.get("/", async (req, res) => {
  try {
    const foods = await Food.find({});

    return res.json({ status: 1, data: foods });
  } catch (err) {
    return res.json({ status: 0, data: err.message });
  }
});

module.exports = router;
