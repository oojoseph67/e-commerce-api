const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const verifyJWT = (token) => {
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  return verify;
};

const cookies = ({ res, user }) => {
  const token = createJWT({ payload: user });  
  const oneDay = 1000 * 60 * 60 * 24

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

};

module.exports = {
  createJWT,
  verifyJWT,
  cookies
};
