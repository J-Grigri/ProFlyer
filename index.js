const https = require("https");
const fs = require("fs");
const app = require("./app");

require("dotenv").config({ path: ".env" });

const server = https.createServer(
    {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.cert")
    },
    app
);

server.listen(process.env.PORT, () => {
    console.log("server listening on port " + process.env.PORT);
});