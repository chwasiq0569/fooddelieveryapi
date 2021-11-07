const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const restaurantRoute = require("./routes/restaurant");

const app = express();
app.use(express.json());
require("dotenv").config();

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("CONNECTION ESTABLISED"))
  .catch((err) => console.log("CONNECTION FAILED: ", err));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening at PORT ${PORT}`));
