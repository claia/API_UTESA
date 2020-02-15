const axios = require("axios");
const { validationResult } = require("express-validator");

const notificationController = {
  sendNotification: async function(device, title, body) {
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
  },

  sendNotificationBroadcast: function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const devices = [
        "cdJSjP27UuM:APA91bGqctJMWrp9VO9HhHEftzb4COeq56M8TnTTmnHbyrF8NFw00BQ5iJeEiO4kF8b7ygeOftmZSTShyxxargK69zkSMlyAXotI5vaXQL1U15-QzvmYq6xnidyp_OtvIuCISjO0Jckk"
      ];

      devices.forEach(token => {
        notificationController.sendNotification(
          token,
          req.body.title,
          req.body.body
        );
      });
      res.status(200).json({ status: true, body: resps });
    } catch (err) {
      res.status(500).json({ status: false, error: err.toString() });
    }
  }
};

module.exports = notificationController;
