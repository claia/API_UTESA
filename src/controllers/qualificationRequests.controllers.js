const { validationResult } = require("express-validator");
const db = require("../database");

const getRequest = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { userid } = req.params;

    const query = `
      SELECT
      s.key || s.name || g.sequence as grupo,
      e.firstname || ' ' || e.lastname as profesor,
      c.sequence::text||c.year::text as ciclo,
      rS.description as estado
      FROM public."checkQualificationRequest" AS ch
      INNER JOIN groups g on ch."groupId" = g.id
      INNER JOIN subjects s on g."subjectsId" = s.id
      INNER JOIN teachers t on g."teachersId" = t.id
      INNER JOIN cycles c on g."cyclesId" = c.id
      INNER JOIN "studentsGroups" sG on g.id = sG."groupsId"
      INNER JOIN requests r on ch."requestId" = r.id
      INNER JOIN students s2 on ch."studentId" = s2.id
      INNER JOIN entities e on t."entitiesId" = e.id
      INNER JOIN "requestStatus" rS on r."requestStatusId" = rS.id
      WHERE s2."studentsId" = ${userid}
    `;

    const data = await db.execQuery(query);

    res.status(200).json(data);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: err.toString() });
  }
};

const createRequest = async (req, res) => {
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
  getRequest,
  createRequest,
  cancelRequest
};
