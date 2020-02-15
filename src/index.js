require("dotenv").config();
const http = require("http");
const app = require("./app");

async function main() {
  try {
    const server = await http.createServer(app);
    server.listen(app.get("port"));
    console.log(`server on port: ${app.get("port")}`);
  } catch (err) {
    console.error(err.toString());
  }
}

main();
