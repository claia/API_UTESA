const { Client } = require("pg");

module.exports = {
  execQuery: async function(query) {
    const client = new Client();

    try {
      await client.connect();
      const res = await client.query(query);
      client.end();
      return res.rows;
    } catch (err) {
      client.end();
      return err;
    }
  }
};
