const CustomError = require("../errors");
const { verifyJWT } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.authToken;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }

  try {
    const { userId, name, role } = verifyJWT(token);
    req.user = { userId, name, role };

    next();
  } catch (error) {
    console.log("authenticateUser error :", error);
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
};

const authorizePermissions = (...roles) => {
  // if (req.user.role !== role) {
  //   throw new CustomError.UnauthorizedError("Unauthorized");
  // }
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
