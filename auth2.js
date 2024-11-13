const jwt = require("jsonwebtoken");
const secret = "YourSecretKeyHere";

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  };
  return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.status(401).json({ error: "Unauthorized. No token provided" });
  } else {
    token = token.slice(7); // Remove 'Bearer ' from token
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized. Invalid token" });
      } else {
        req.provider = decodedToken;
        next();
      }
    });
  }
};

module.exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden. Admin access required" });
  }
};
