const indexController = (function() {
  return {
    index: function(req, res) {
      res.render("index", { title: "UTESA WEBSERVICE" });
    }
  };
})();

module.exports = indexController;
