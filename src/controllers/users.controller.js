const db = require("../database");

const indexController = {
  index: async function(req, res) {
    try {
      const data = await db.execQuery("select * from users");
      res.status(200).json({
        status: true,
        body: data
      });
    } catch (err) {
      console.error(err.toString());
      return res
        .status(500)
        .json({ status: false, error: "Someting was wrong" });
    }
  }
};

module.exports = indexController;
