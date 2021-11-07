const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  categories: [String],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      message: {
        type: String,
      },
    },
  ],
  rating: { type: String },
  foods: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
