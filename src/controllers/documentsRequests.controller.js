const { validationResult } = require("express-validator");
const db = require("../database");

const indexController = {
  index: async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const { studentsid } = req.headers;
    const query = `
      SELECT 
        doc.description,
        docreq.status
      FROM public.requests as req
      INNER JOIN
      public."documentRequests" as docreq ON docreq."requestsId" = req.id
      INNER JOIN
      public.documents as doc ON doc.id = docreq."documentsId"
      WHERE req."studentsId" = ${studentsid}
    `;

    try {
      const data = await db.execQuery(query);
      res.status(200).json(data);
    } catch (err) {
      console.error(err.toString());
      return res
        .status(500)
        .json({ status: false, error: "Someting was wrong" });
    }
  },
  getDocuments: async function(req, res) {
    try {
      const data = await db.execQuery("select * from public.documents;");
      res.status(200).json(data);
    } catch (err) {
      console.error(err.toString());
      return res
        .status(500)
        .json({ status: false, error: "Someting was wrong" });
    }
  },
  requestDocument: async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    try {
      const { studentsid, documentsid } = req.body;

      const query = `
        SELECT public."addDocumentRequest"(
          ${studentsid}, 
          ${documentsid}
        ); 
      `;

      await db.execQuery(query);

      res.status(200).json();
    } catch (err) {
      console.error(err.toString());
      return res.status(500).json({ error: "Someting was wrong" });
    }
  }
};

module.exports = indexController;
