const db = require("../database");

class Request {
  constructor(id) {
    this.id = id;
  }

  async update(status) {
    if (!status) throw "status empty";

    try {
      const query = `UPDATE public.requests SET "requestStatusId" = ${status} WHERE id = ${this.id}`;
      const data = await db.execQuery(query);
      return data;
    } catch (err) {
      throw err.toString();
    }
  }

  async cancel() {
    try {
      const query = `UPDATE public.requests SET "requestStatusId" = 4 WHERE id = ${this.id}`;
      const data = await db.execQuery(query);
      return data;
    } catch (err) {
      throw err.toString();
    }
  }
}

module.exports = Request;
