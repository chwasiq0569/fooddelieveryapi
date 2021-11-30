const router = require("express").Router();
const User = require("../model/User");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { throughError } = require("../utils");
var jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .trim()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .error((errors) => throughError(errors, "Username")),
    email: Joi.string()
      .trim()
      .email()
      .required()
      .error((errors) => throughError(errors, "Email")),
    password: Joi.string()
      .min(5)
      .max(30)
      .required()
      .error((errors) => throughError(errors, "Password")),
  });

  try {
    const userExists = await User.findOne({ email: req.body.email });

    await schema.validateAsync(req.body);

    if (userExists)
      return res.json({ status: 0, message: "User Already Exists" });

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      ...req.body,
      password: hashedPassword,
    };
    const user = new User(data);
    if (user) {
      await user.save();
      res.json({ status: 1, data: user });
    } else res.json({ status: 0, message: "User not Created" });
  } catch (err) {
    res.json({ status: 0, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (!userExists) return res.json({ status: 0, message: "User Not Exists" });

  const { username, email } = userExists;

  let token = jwt.sign({ username, email }, process.env.JWT_PRIVATE_KEY);

  try {
    const { password } = req.body;
    const userLoggedIn = await bcrypt.compare(password, userExists.password);
    if (userLoggedIn) {
      res.json({
        status: 1,
        data: {
          id: userExists._id,
          username,
          email,
          token,
        },
      });
    } else {
      res.json({ status: 0, message: "Invalid Email or Password!" });
    }
  } catch (err) {
    res.json({ status: 0, message: err.message });
  }
});

module.exports = router;
