const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { unHash } = require("../utils/hash");
const { createJWT, verifyJWT, cookies } = require("../utils/jwt");
const { createTokenUser } = require("../utils/createTokenUser");

const { CustomAPIError, UnauthenticatedError, NotFoundError, BadRequestError } =
  CustomError;

const login = async (req, res) => {
  const { body } = req;
  const { email, password: requestPassword } = body;

  if (!email || !requestPassword) {
    throw new BadRequestError("Please provide both email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const {
    _id: userId,
    name: checkedName,
    email: checkedUserEmail,
    password: databasePassword,
    role,
  } = user;

  const isMatch = await unHash(requestPassword, databasePassword);
  if (!isMatch) {
    throw new UnauthenticatedError("Wrong Password");
  }

  // const tokenUser = { userId, name: checkedName, role };
  const tokenUser = createTokenUser(user);
  cookies({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({
    msg: `user exists with name ${checkedName}`,
    user: { checkedName, checkedUserEmail },
  });
};

const register = async (req, res) => {
  const { body } = req;
  const { name, email, password } = body;

  // checking email
  const emailCheck = await User.findOne({ email });
  if (emailCheck) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // registering the first user as an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  const { _id: userId, name: regName, email: regEmail, role: regRole } = user;

  // const tokenUser = { userId, name: regName, role: regRole };
  const tokenUser = createTokenUser(user);
  cookies({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({
    msg: `user created with name ${name}`,
    user: { name, email },
  });
};

const logout = async (req, res) => {
  res.cookie("authToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = { login, register, logout };
