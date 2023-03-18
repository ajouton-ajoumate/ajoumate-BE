const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const chatsRef = db.collection("chat");
const usersRef = db.collection("user");

const eventHandler = (io, socket) => {
  socket.on("message", async (data) => {
    console.log(data);
    await chatsRef.add(data);
    const userRef = await usersRef.doc(data.To).get();

    socket.emit("message", data);
  });

  socket.on("set socketId", async (userId) => {
    console.log(userId);

    const userRef = await usersRef.doc(userId).get();

    let user = userRef.data();
    user.socketId = socket.id;

    await usersRef.doc(userId).set(user);
  });
};

module.exports = eventHandler;
