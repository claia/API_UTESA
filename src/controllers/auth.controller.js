const { validationResult } = require("express-validator");
const { sign } = require("jsonwebtoken");
const { compareSync } = require("bcrypt");
const db = require("../database");

const authController = {
  login: async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { studentid, password, enclosuresid } = req.body;

      const query = `
        SELECT s."studentsId",u.password
        FROM public.users as u
        INNER JOIN
        public.entities as e ON e.id = u."entitiesId"
        INNER JOIN
        public.students as s ON e.id = u."entitiesId"
        WHERE s."studentsId" = ${studentid} AND e."enclosuresId" = ${enclosuresid}
        LIMIT 1
      `;

      const data = await db.execQuery(query);

      if (!data.length > 0) return res.status(401).json();

      if (!compareSync(password, data[0].password)) {
        return res.status(401).json({
          status: false
        });
      }

      const studentQuery = `
        SELECT
        us.id as userid,
        s."studentsId" as studentsid,
        s.id as studentid,
        e.firsname,
        e.lastname,
        en."name",
        p.id as pensumid,
        c."key",
        c.title
        FROM public.users as us
        INNER JOIN
        public.students as s ON us.id = s.id
        INNER JOIN
        public.entities as e ON e.id = s."entitiesId"
        INNER JOIN
        public.enclosures as en ON en.id = e."enclosuresId"
        INNER JOIN
        public."pensumHeaders" as p ON p.id = s."pensumHeadersId"
        INNER JOIN
        public.careers c ON c.id = p."careersId"
        WHERE
        s."studentsId" = ${studentid}
      `;

      const studentData = await db.execQuery(studentQuery);

      const token = sign(studentData[0], process.env.privateKey, {
        expiresIn: "28d"
      });

      res.status(200).json({ status: true, token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false });
    }
  },
  insertDeviceId: async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const { userid, deviceid } = req.body;

      const getDeviceIdQuery = `
        SELECT g."usersId" as usersid 
        FROM public.gadgets as g
        WHERE g.token = '${deviceid}'
      `;

      const insertDeviceIdQuery = `
        INSERT INTO public.gadgets("usersId", token, notify)
        VALUES (${userid}, '${deviceid}', true)
      `;

      const devices = await db.execQuery(getDeviceIdQuery);

      if (!devices.length > 0) await db.execQuery(insertDeviceIdQuery);
      else {
        const updateDeviceIdQuery = `
          UPDATE public.gadgets
          SET "usersId"= ${userid}
          WHERE "usersId" = ${devices[0].usersid};
        `;

        await db.execQuery(updateDeviceIdQuery);
      }

      res.status(200).json({ status: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false });
    }
  }
};

module.exports = authController;
