const axios = require("axios");
const { validationResult } = require("express-validator");
const db = require("../database");

const sendNotification = async function(device, title, body) {
  try {
    const options = {
      method: "post",
      url: "https://fcm.googleapis.com/fcm/send",
      data: {
        to: device,
        notification: {
          title: title,
          body: body
        }
      },
      headers: {
        Authorization: process.env.FIREBASE_AUTH,
        "Content-Type": "application/json"
      }
    };

    return await axios(options);
  } catch (err) {
    console.error(err);
    return err;
  }
};

const sendNotificationBroadcast = async function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const getDevicesQuery = `
        SELECT token
        FROM public.gadgets
        WHERE notify = true;
      `;

    const devices = await db.execQuery(getDevicesQuery);

    devices.forEach(device => {
      sendNotification(device.token, req.body.title, req.body.body);
    });
    res.status(200).json({ status: true });
  } catch (err) {
    console.log(err.toString());
    res.status(500).json({ status: false, error: err.toString() });
  }
};

module.exports = {
  sendNotificationBroadcast
};
