const { validationResult } = require("express-validator");
const db = require("../database");

const getGroups = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { search } = req.params;

    const query = `select * FROM "searchGroups"('${search}');`;

    const data = await db.execQuery(query);

    res.status(200).json(data);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: err.toString() });
  }
};

module.exports = {
  getGroups
};
