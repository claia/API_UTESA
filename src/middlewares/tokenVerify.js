const { verify } = require("jsonwebtoken");

const verifyToken = function(req, res, next) {
  const { token } = req.headers;

  if (!token) return res.sendStatus(401);

  try {
    verify(token, process.env.privateKey);
    next();
  } catch (err) {
    return res.status(401).json({ error: err.toString() });
  }
};

module.exports = {
  verifyToken
};
