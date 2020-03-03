const { validationResult } = require("express-validator");
const { sign } = require("jsonwebtoken");
const { compareSync } = require("bcrypt");
const db = require("../database");

const login = async function(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { studentid, password, enclosuresid } = req.body;

    const query = `select * from "searchStudent"(${studentid}, ${enclosuresid});`;

    const data = await db.execQuery(query);

    if (!data.length > 0) return res.status(401).json();

    if (!compareSync(password, data[0].password)) {
      return res.status(401).json({
        status: false
      });
    }

    const studentQuery = `select * from "getStudentStats"('${studentid}');`;

    const studentData = await db.execQuery(studentQuery);

    const studentQualificationQuery = `select * from "getQualificationByCycle"(${studentData[0].studentid},(SELECT c.id FROM public.cycles as c ORDER BY  c.id DESC LIMIT 1));`;
    const studentQualificationData = await db.execQuery(
      studentQualificationQuery
    );

    studentData[0].qualification = studentQualificationData;

    const token = sign(studentData[0], process.env.privateKey, {
      expiresIn: "28d"
    });

    res.status(200).json({ status: true, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false });
  }
};

const insertDeviceId = async function(req, res) {
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
};

module.exports = {
  login,
  insertDeviceId
};
