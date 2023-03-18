const express = require("express");
const bodyParser = require("body-parser");
const serviceAccount = require("./path/to/serviceAccountKey.json");
const { initializeApp, cert } = require("firebase-admin/app");

const main = () => {
  const app = express();
  const PORT = 3000;
  const server = require("http").createServer(app);
  const io = require("socket.io")(server);

  initializeApp({
    credential: cert(serviceAccount),
  });

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());

  app.use("/auth", require("./routes/auth"));

  io.on("connection", (socket) => {
    console.log("hello socket");
  });

  server.listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
  });

  app.get("/", function (req, res) {
    res.send("hello world");
  });
};

main();
