const fs = require("fs");
const app = require("./app");

require("dotenv").config({ path: ".env" });

let server
if (process.env.NODE_ENV === "development") {
    const https = require("https");
    server = https.createServer(
        {
            key: fs.readFileSync("server.key"),
            cert: fs.readFileSync("server.cert")
        },
        app
    );
} else {
    const http = require("http");
    server = http.createServer(app);
}


server.listen(process.env.PORT, () => {
    console.log(process.env.NODE_ENV + "server listening on port " + process.env.PORT);
});