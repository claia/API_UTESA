const { validationResult } = require("express-validator");
const db = require("../database");

const getGroups = async (req, res) => {
  try {
    const data = await db.execQuery("SELECT * FROM public.groups");

    res.status(200).json(data);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: err.toString() });
  }
};

module.exports = {
  getGroups,
};
