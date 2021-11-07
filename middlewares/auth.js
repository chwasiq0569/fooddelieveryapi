var jwt = require("jsonwebtoken");

const authorizeUser = async (req, res, next) => {
  try {
    const decoded = await jwt.verify(
      req.headers.token,
      process.env.JWT_PRIVATE_KEY
    );
    if (decoded) {
      next();
    } else {
      res.json({ status: 0, message: "User not Authorized" });
    }
  } catch (err) {
    res.json({ status: 0, message: err.message });
  }
};

module.exports = { authorizeUser };
