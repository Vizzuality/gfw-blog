const frontity = require("./build/server").default;
const http = require("http");
const server = http.createServer(frontity);
const port = process.env.PORT || 3000;
server.listen(port);
console.info('Listening on port', port);