const router = require("express").Router();
const Restaurant = require("../model/Restaurant");
const Joi = require("@hapi/joi");
const { throughError } = require("../utils");
const { authorizeUser } = require("../middlewares/auth");
const mongoose = require("mongoose");

router.get("/", authorizeUser, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});

    return res.json({ status: 1, data: restaurants });
  } catch (err) {
    return res.json({ status: 0, data: err.message });
  }
});

router.get("/:id", authorizeUser, async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (restaurant) {
        return res.json({ status: 1, data: restaurant });
      } else {
        return res.json({ status: 0, data: "No Restaurant Found!" });
      }
    } catch (err) {
      return res.json({ status: 0, data: err.message });
    }
  }
  return res.json({ status: 0, data: "No Restaurant Found!" });
});

router.post("/addrestaurant", authorizeUser, async (req, res) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .trim()
      .min(3)
      .max(30)
      .required()
      .error((errors) => throughError(errors, "Restaurant Name")),
    image: Joi.string()
      .trim()
      .required()
      .error((errors) => throughError(errors, "Restaurant Image")),
  });

  console.log("req.headers.token", req.headers.token);

  try {
    const restaurantExists = await Restaurant.findOne({
      name: req.body.name,
    });

    console.log("req.body", req.body);

    await schema.validateAsync({
      name: req.body.name,
      image: req.body.name,
    });

    if (restaurantExists)
      return res.json({ status: 0, message: "Restaurant already exists." });

    const restaurant = new Restaurant(req.body);

    if (restaurant) {
      await restaurant.save();

      return res.json({ status: 1, data: restaurant });
    }
  } catch (err) {
    return res.json({ status: 0, message: err.message });
  }
});

module.exports = router;
