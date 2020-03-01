const { validationResult } = require("express-validator");
const db = require("../database");

const getDocuments = async (req, res) => {
  try {
    const data = await db.execQuery("SELECT * FROM public.documents");

    res.status(200).json(data);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: err.toString() });
  }
};

const getDocumentsByUserId = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;

    const query = `
      SELECT
        requests."userId",
        documents.description
      FROM requests
      INNER JOIN "documentRequest" ON requests.id = "documentRequest"."requestId"
      INNER JOIN documents ON documents.id  = "documentRequest"."documentId"
      WHERE requests."userId" = ${id}
    `;

    const data = await db.execQuery(query);

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.toString() });
  }
};

const createRequest = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { userid, documentid, razon } = req.body;

    const query = `select "insertDocumentRequest"(${userid},${documentid},'${razon}');`;

    const data = await db.execQuery(query);

    res.status(200).json(data);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: err.toString() });
  }
};

module.exports = {
  getDocuments,
  getDocumentsByUserId,
  createRequest
};
