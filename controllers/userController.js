const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { unHash, hashedPassword } = require("../utils/hash");

const { CustomAPIError, UnauthenticatedError, NotFoundError, BadRequestError } =
  CustomError;

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};
const getSingeUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new NotFoundError(`No user with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = async (req, res) => {
  res.send("update user");
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError(
      "Please provide both oldPassword and newPassword"
    );
  }

  const user = await User.findById(userId);

  if (!userId) {
    throw new NotFoundError(`No user with id ${userId}`);
  }

  const isMatch = await unHash(oldPassword, user.password);

  if (!isMatch) {
    throw new UnauthenticatedError("Wrong Password");
  }

  if (oldPassword === newPassword) {
    throw new BadRequestError(
      "Old password and new password cannot be the same"
    );
  }

  const hashedPass = await hashedPassword(newPassword);

  await User.findByIdAndUpdate(userId, { password: hashedPass }, { new: true });
  
  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};
const deleteUser = async (req, res) => {
  res.send("delete user");
};

module.exports = {
  getAllUsers,
  getSingeUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
