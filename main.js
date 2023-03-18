const express = require("express");
const serviceAccount = require("./path/to/serviceAccountKey.json");
const { initializeApp, cert } = require("firebase-admin/app");

const main = () => {
  const app = express();
  const PORT = 3000;
  const server = require("http").createServer(app);
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    console.log("hello socket");
  });

  initializeApp({
    credential: cert(serviceAccount),
  });

  server.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
  });

  app.get('/', function(req, res) {
    res.send('hello world');
  });
};

main();