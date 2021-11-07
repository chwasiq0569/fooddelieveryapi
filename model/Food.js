const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: { type: String, required: true },
  image: {
    type: String,
    required: true,
  },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
});

const Food = mongoose.model("Food", FoodSchema);

module.exports = Food;
