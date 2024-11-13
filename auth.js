const jwt = require("jsonwebtoken");
const secret = "YourSecretKeyHere";

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    role: user.role 
  };
  
  return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.status(401).json({ error: "Unauthorized. No token provided" });
  } else {
    token = token.slice(7);  // Remove "Bearer " from the token string

    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized. Invalid token" });
      } else {
        req.user = decodedToken;  
        return next();  
      }
    });
  }
};


module.exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden. Admin access required" });
  }
};


module.exports.verifyStudent = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  token = token.slice(7); 

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    if (decodedToken.role === "Student") {
      req.user = decodedToken;  
      return next(); 
    } else {
      return res.status(403).json({ error: "Forbidden. Student access required." });
    }
  });
};


module.exports.verifyProvider = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  token = token.slice(7); 

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    if (decodedToken.role === "Provider") {
      req.user = decodedToken;
      return next();
    } else {
      return res.status(403).json({ error: "Forbidden. Provider access required." });
    }
  });
};
