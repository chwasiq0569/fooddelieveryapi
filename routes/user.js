const router = require("express").Router();
const User = require("../model/User");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { throughError } = require("../utils");

router.post("/register", async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.json({ status: 0, message: "User Already Exists" });

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
    const { password } = req.body;
    await schema.validateAsync(req.body);
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

module.exports = router;
