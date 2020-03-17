const { validationResult } = require("express-validator");
const db = require("../../../core/database");
const Request = require("../../../core/classes/request");

class QualificationRequest {
  async getRequest(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      let { userid, status } = req.headers;

      status = status.replace("[", "(");

      status = status.replace("]", ")");

      const query = `
        SELECT
        r.id as requestid,
        s.key || g.sequence as grupo,
        s.name as asignatura,
        rS.id as estado_code,
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
        WHERE r."userId" = ${userid}
        AND  r."requestStatusId" IN ${status}
      `;

      const data = await db.execQuery(query);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async getGroupByStudentId(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { studentid } = req.params;

      const query = `
        SELECT
        g.id as groupid,
        s.key || g.sequence as grupo,
        s.name
        FROM groups AS g
        INNER JOIN "studentsGroups" sG on g.id = sG."groupsId"
        INNER JOIN subjects s on g."subjectsId" = s.id
        WHERE g."cyclesId" = (SELECT c.id FROM public.cycles as c ORDER BY  c.id DESC LIMIT 1)
        AND sG."studentsId" = ${studentid};
      `;

      const data = await db.execQuery(query);

      res.status(200).json(data);
    } catch (error) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async updateRequestStatus(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { requestid } = req.headers;
      const request = new Request(requestid);
      const data = await request.update(1);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async createRequest(req, res) {
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
  }

  async cancelRequest(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { requestid } = req.headers;

      const request = new Request(requestid);
      const data = await request.cancel();

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }
}

module.exports = new QualificationRequest();

// const getRequest = async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }

//   try {
//     const { userid } = req.params;

//     const query = `
//       SELECT
//       r.id as requestid,
//       s.key || g.sequence as grupo,
//       s.name as asignatura,
//       rS.id as estado_code,
//       e.firstname || ' ' || e.lastname as profesor,
//       c.sequence::text||c.year::text as ciclo,
//       rS.description as estado
//       FROM public."checkQualificationRequest" AS ch
//       INNER JOIN groups g on ch."groupId" = g.id
//       INNER JOIN subjects s on g."subjectsId" = s.id
//       INNER JOIN teachers t on g."teachersId" = t.id
//       INNER JOIN cycles c on g."cyclesId" = c.id
//       INNER JOIN "studentsGroups" sG on g.id = sG."groupsId"
//       INNER JOIN requests r on ch."requestId" = r.id
//       INNER JOIN students s2 on ch."studentId" = s2.id
//       INNER JOIN entities e on t."entitiesId" = e.id
//       INNER JOIN "requestStatus" rS on r."requestStatusId" = rS.id
//       WHERE r."userId" = ${userid}
//       AND  r."requestStatusId" <> 4
//     `;

//     const data = await db.execQuery(query);

//     res.status(200).json(data);
//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({ error: err.toString() });
//   }
// };

// const getGroupByStudentId = async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }

//   try {
//     const { studentid } = req.params;

//     const query = `
//       SELECT
//       g.id as groupid,
//       s.key || g.sequence as grupo,
//       s.name
//       FROM groups AS g
//       INNER JOIN "studentsGroups" sG on g.id = sG."groupsId"
//       INNER JOIN subjects s on g."subjectsId" = s.id
//       WHERE g."cyclesId" = (SELECT c.id FROM public.cycles as c ORDER BY  c.id DESC LIMIT 1)
//       AND sG."studentsId" = ${studentid};
//     `;

//     const data = await db.execQuery(query);

//     res.status(200).json(data);
//   } catch (error) {
//     console.log(err);

//     return res.status(500).json({ error: err.toString() });
//   }
// };

// const createRequest = async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }

//   try {
//     const { userid, groupid, razon } = req.body;

//     const query = `select "insertCheckQualificationRequest"(${userid},${groupid},'${razon}');`;

//     const data = await db.execQuery(query);

//     res.status(200).json(data);
//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({ error: err.toString() });
//   }
// };

// const cancelRequest = async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }

//   try {
//     const { requestid } = req.headers;

//     const request = new Request(requestid);
//     const data = await request.cancel();

//     res.status(200).json(data);
//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({ error: err.toString() });
//   }
// };

// module.exports = {
//   getRequest,
//   createRequest,
//   cancelRequest,
//   getGroupByStudentId
// };
