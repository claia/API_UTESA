require("dotenv").config();
const http = require("http");
const app = require("./app");

async function main() {
  try {
    await http.createServer(app).listen(app.get("port"));
    console.log(`server on port: ${app.get("port")}`);
  } catch (error) {
    console.error(error);
  }
}

main();
