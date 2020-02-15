const jwt = require("jsonwebtoken");

const authController = {
  login: function(req, res) {
    const token = jwt.sign({ foo: "bar" }, process.env.privateKey, {
      expiresIn: "30d"
    });

    res.status(200).json({ token });
  }
};

module.exports = authController;
