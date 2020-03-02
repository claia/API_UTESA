const { validationResult } = require("express-validator");
const db = require("../database");

const getGroups = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { subjectId } = req.params;
    const query = `
        SELECT groups.sequence, s.name AS "subject", d.name AS "days", gC."startHour", gC."finishHour", (c.building  || c.level || '-' || c.enumeration) AS "classroom"
        FROM "groups"
        INNER JOIN "groupClassroom" gC ON groups.id = gC."groupsId"
        INNER JOIN subjects s ON groups."subjectsId" = s.id
        INNER JOIN entities e ON e.id = "groups"."teachersId"
        INNER JOIN days d ON gC."daysId" = d.id
        INNER JOIN classrooms c ON gC."classroomsId" = c.id
        WHERE groups."subjectsId" = ${subjectId}
     `;
    const data = await db.execQuery(query);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.toString() });
  }
};

module.exports = {
  getGroups,
};
