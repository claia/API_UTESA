const { validationResult } = require("express-validator");
const db = require("../../../core/database");
const Request = require("../../../core/classes/request");

class NewGroupRequest {
  async getSubjects(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { studentid, pensumid } = req.params;
      const query = `
        SELECT
        s.id,
        s.name as asignatura
        FROM public.subjects as s
        INNER JOIN "pensumBodys" pB on s.id = pB."subjectsId"
        WHERE pb."pensumHeadersId" = ${pensumid} AND
        s.id NOT IN (
        SELECT
        s.id
        FROM public.subjects AS s
        INNER JOIN groups g on s.id = g."subjectsId"
        INNER JOIN "studentsGroups" sG on g.id = sG."groupsId"
        WHERE sG."firstQualification"+sG."secondQualification"+sG."thirdQualification"+sG."extraPoints" >= 70 AND
        sG."studentsId" = ${studentid}
        );
      `;

      const data = await db.execQuery(query);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async getAllGroupRequest(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { studentid } = req.params;
      const query = `
        SELECT
        nGR."studentsId" as studentid,
        s.key as clave,
        nGR.id as newRequestId,
        nGR.tanda,
        s.name as asignatura,
        r.id as requestid,
        (select count(j.id) from public."joinGroupRequest" as j where j."newGroupRequestId" = nGR.id) as estudiantes,
        rS.description as estado,
        rS.id as estado_code
        FROM public."newGroupRequest" AS nGR
        INNER JOIN requests r on nGR."requestId" = r.id
        INNER JOIN "requestStatus" rS on r."requestStatusId" = rS.id
        INNER JOIN subjects s on nGR."subjectsId" = s.id
        WHERE s.id NOT IN (
        SELECT
        s.id
        FROM public.subjects AS s
        INNER JOIN groups g on s.id = g."subjectsId"
        INNER JOIN "studentsGroups" sG on g.id = sG."groupsId"
        WHERE sG."firstQualification"+sG."secondQualification"+sG."thirdQualification" >= 70 AND
        sG."studentsId" = ${studentid} 
        ) AND r."requestStatusId" <> 4 ;
      `;

      const data = await db.execQuery(query);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async addGroupRequest(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { userid, subjectid, tanda, diasid } = req.body;
      const query = `
        SELECT * FROM "insertGroupRequest"(${userid}, ${subjectid} , '${tanda}' , ARRAY ${diasid});
      `;
      console.log(query);

      const data = await db.execQuery(query);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async getAlDayFromRequest(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { requestid } = req.headers;

      const query = `
        SELECT
        d.name as dias
        FROM "groupRequestDayAvailable" as gRDA
        INNER JOIN "newGroupRequest" nGR on gRDA."newGroupRequestId" = nGR.id
        INNER JOIN requests r on nGR."requestId" = r.id
        INNER JOIN days d on gRDA."dayId" = d.id
        WHERE r.id = ${requestid}
      `;

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

  async joinToRequest(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { requestid, studentid } = req.body;
      const query = `
        INSERT INTO "joinGroupRequest"("newGroupRequestId", "studentId", id)
        VALUES (${requestid},${studentid},default);
      `;

      const data = await db.execQuery(query);

      res.status(200).json(data);
    } catch (error) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async exitFromRequest(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { studentid } = req.headers;
      const query = `
        DELETE FROM public."joinGroupRequest" as j WHERE j."studentId" = ${studentid}
      `;

      await db.execQuery(query);

      res.sendStatus(200);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async getStudentsJoin(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { requestid } = req.headers;
      const query = `
        SELECT
        s.id as studentid
        FROM "joinGroupRequest" as j
        INNER JOIN students as s on j."studentId" = s.id
        INNER JOIN "newGroupRequest" nGR on j."newGroupRequestId" = nGR.id
        INNER JOIN requests r on nGR."requestId" = r.id
        WHERE r.id = ${requestid}
      `;

      const data = await db.execQuery(query);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }
}

module.exports = new NewGroupRequest();
