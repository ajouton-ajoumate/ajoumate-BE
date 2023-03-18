const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const chatsRef = db.collection("chat");
const usersRef = db.collection("user");

const eventHandler = (io, socket) => {
  socket.on("message", async (data) => {
    try {
      await chatsRef.add(data);
      const userRef = await usersRef.where("Nickname", "==", data.To).get();
      const user = userRef.docs[0];

      io.to(user.data().socketId).emit("message", data);

      socket.emit("message", data);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("set socketId", async (userId) => {
    try {
      const userRef = await usersRef.doc(userId).get();

      let user = userRef.data();

      user.socketId = socket.id;

      await usersRef.doc(userId).set(user);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("all message", async () => {
    
  })

  socket.on("create room", () => {
    
  })
};

module.exports = eventHandler;
