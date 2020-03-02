const { validationResult } = require("express-validator");
const db = require("../database");

const getDocuments = async (req, res) => {
  try {
    const data = await db.execQuery(
      "SELECT * FROM public.documents where status=true"
    );

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
        r.id as requestid,
        r."emissionDate",
        rS.id as estado_code,
        rS.description as estado,
        d.description,
        Dt.name as tipo,
        dR.image as image
      FROM "documentRequest" as dR
      INNER JOIN documents d on dR."documentId" = d.id
      INNER JOIN requests r on dR."requestId" = r.id
      INNER JOIN "requestStatus" rS on r."requestStatusId" = rS.id
      INNER JOIN "documentTypes" dT on d."documentTypeId" = dT.id
      WHERE r."userId" = ${id} AND  rS.id <> 4
    `;

    const data = await db.execQuery(query);

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.toString() });
  }
};

const updateRequestStatus = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { requestid } = req.headers;

    const data = await db.execQuery(
      `UPDATE public.requests SET "requestStatusId" = 1 WHERE id = ${requestid}`
    );

    res.status(200).json(data);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: err.toString() });
  }
};

const cancelRequest = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { requestid } = req.headers;

    const data = await db.execQuery(
      `UPDATE public.requests SET "requestStatusId" = 4 WHERE id = ${requestid}`
    );

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
  createRequest,
  updateRequestStatus,
  cancelRequest
};
