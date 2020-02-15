const axios = require("axios");

const notificationController = {
  sendNotification: async function(device, title, body) {
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

    console.log(options);
    try {
      return await axios(options);
    } catch (err) {
      console.error(err);
      return err;
    }
  },

  sendNotificationBroadcast: function(req, res) {
    const title = req.body.title;
    const body = req.body.body;
    const devices = [
      "cdJSjP27UuM:APA91bGqctJMWrp9VO9HhHEftzb4COeq56M8TnTTmnHbyrF8NFw00BQ5iJeEiO4kF8b7ygeOftmZSTShyxxargK69zkSMlyAXotI5vaXQL1U15-QzvmYq6xnidyp_OtvIuCISjO0Jckk"
    ];
    if (!title) return res.status(500).json({ status: false });
    if (!body) return res.status(500).json({ status: false });

    try {
      devices.forEach(token =>
        notificationController.sendNotification(token, title, body)
      );
      res.status(200).json({ status: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false });
    }
  }
};

module.exports = notificationController;
