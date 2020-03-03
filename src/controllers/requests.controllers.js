const { validationResult } = require("express-validator");
const db = require("../database");

const checkQualificationRequest = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { userid, groupid, razon } = req.body;

    const query = `select "insertCheckQualificationRequest"(${userid},${groupid},'${razon}');`;

    const data = await db.execQuery(query);

    res.status(200).json(data);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: err.toString() });
  }
};

const cancelRequest = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { requestid } = req.headers;

    const data = await db.execQuery(
      `UPDATE public.requests SET "requestStatusId" = 4 WHERE id = ${requestid}`
    );

    res.status(200).json(data);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: err.toString() });
  }
};

module.exports = {
  checkQualificationRequest,
  cancelRequest,
};
