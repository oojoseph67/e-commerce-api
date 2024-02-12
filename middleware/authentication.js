const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, name } = payload;

    req.user = { userId, name };
    next();
  } catch (error) {
    console.log("🚀 ~ auth ~ error:", error);
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = auth;
