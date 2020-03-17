const { validationResult } = require("express-validator");
const db = require("../../../core/database");

class Group {
  async getGroups(req, res) {
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
  }

  async getGroupComments(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { groupid } = req.params;
      const query = `
        SELECT 
        e.firstname || ' '|| e.lastname as student ,
        g.comment
        FROM public."studentsGroups" as g
        INNER JOIN students s on g."studentsId" = s.id
        INNER JOIN entities e on s."entitiesId" = e.id
        WHERE g."groupsId" = ${groupid} AND g.comment IS NOT NULL
      `;
      const data = await db.execQuery(query);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.toString() });
    }
  }

  async addComment(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { groupid, studentid, comment } = req.body;
      const query = `
        UPDATE public."studentsGroups"
        SET comment = '${comment}'
        WHERE "groupsId"= ${groupid} AND "studentsId" = ${studentid}
      `;

      const data = await db.execQuery(query);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.toString() });
    }
  }

  async updateLike(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { groupid, studentid, like } = req.body;
      const query = `
        UPDATE public."studentsGroups"
        SET "like" = ${like}::boolean
        WHERE "groupsId"= ${groupid} AND "studentsId" = ${studentid}
      `;
      const data = await db.execQuery(query);
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.toString() });
    }
  }
}

module.exports = new Group();
