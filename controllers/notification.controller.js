const axios = require("axios");

const notificationController = (function() {
  function sendNotification(device, title, body) {
    axios({
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
        Authorization:
          "key=AAAARNgX2vg:APA91bHHOuaz2zkEakadpvPbfnqHebfSnWx7U17QK7cmBk835aJHJoZgtDavGH6r_iFSH9scwJK0He_JWgHD1dvJGkv_rQ-DMUs7f2FOXIdr_3loU4GD1IXH_hWshOAwRBDN4GtXYRdE",
        "Content-Type": "application/json"
      }
    }).catch(err => console.log(err));
  }

  return {
    index: function(req, res) {
      res.render("index", { title: "UTESA WEBSERVICE" });
    },
    send: (req, res) => {
      const title = req.body.title;
      const body = req.body.body;
      const devices = [
        "cdJSjP27UuM:APA91bGqctJMWrp9VO9HhHEftzb4COeq56M8TnTTmnHbyrF8NFw00BQ5iJeEiO4kF8b7ygeOftmZSTShyxxargK69zkSMlyAXotI5vaXQL1U15-QzvmYq6xnidyp_OtvIuCISjO0Jckk"
      ];
      if (!title) return res.status(500).json({ status: false });
      if (!body) return res.status(500).json({ status: false });

      devices.forEach(token => sendNotification(token, title, body));

      res.status(200).json({ status: true });
    }
  };
})();

module.exports = notificationController;
