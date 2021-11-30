const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const restaurantRoute = require("./routes/restaurant");
const foodRoute = require("./routes/food");
const reviewRoute = require("./routes/review");
const cartRoute = require("./routes/cart");
const Cart = require("./model/Cart");
const router = require("express").Router();

const app = express();
app.use(express.json());
require("dotenv").config();

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("CONNECTION ESTABLISED"))
  .catch((err) => console.log("CONNECTION FAILED: ", err));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/food", foodRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/cart", cartRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening at PORT ${PORT}`));

// const cart = Cart.findOne({ user: req.params.userId });
//   if (cart) {
//     let item = await Cart.updateOne({
//       $push: {
//         product: req.body.product,
//       },
//     });
//     res.json({ status: 1, data: item });
//     console.log("item", item);
//   } else {
//     const cart = new Cart(req.body);
//     await cart.save();
//     res.json({ status: 1, data: cart });
//   }
