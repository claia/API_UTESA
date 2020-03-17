const { validationResult } = require("express-validator");
const db = require("../../../core/database");
const Request = require("../../../core/classes/request");

class DocumentRequest {
  async getDocuments(_, res) {
    try {
      const data = await db.execQuery(
        "SELECT * FROM public.documents where status=true"
      );

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async getDocumentsByUserId(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      let { id, status } = req.headers;

      status = status.replace("[", "(");

      status = status.replace("]", ")");

      const query = `
        SELECT
          r.id as requestid,
          r."emissionDate",
          rS.id as estado_code,
          rS.description as estado,
          d.description,
          dT.name as tipo
        FROM "documentRequest" as dR
        INNER JOIN documents d on dR."documentId" = d.id
        INNER JOIN requests r on dR."requestId" = r.id
        INNER JOIN "requestStatus" rS on r."requestStatusId" = rS.id
        INNER JOIN "documentTypes" dT on d."documentTypeId" = dT.id
        WHERE r."userId" = ${id} AND r."requestStatusId" IN ${status}
    `;

      const data = await db.execQuery(query);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.toString() });
    }
  }

  async updateRequestStatus(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { requestid } = req.headers;
      const request = new Request(requestid);
      const data = await request.update(1);

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async cancelRequest(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { requestid } = req.headers;
      const request = new Request(requestid);
      const data = await request.cancel();

      res.status(200).json(data);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: err.toString() });
    }
  }

  async createRequest(req, res) {
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
  }
}

module.exports = new DocumentRequest();
