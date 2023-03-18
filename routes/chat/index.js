const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const chatsRef = db.collection("chat");
const usersRef = db.collection("user");
const chatRoomRef = db.collection("chatRoom");

const getRoomList = async (UserID) => {
  let ret = [];

  const fromSnapshot = await chatRoomRef.where("From", "==", UserID).get();

  fromSnapshot.docs.map((from) => {
    ret.push(from.data().To);
  });

  const toSnapshot = await chatRoomRef.where("To", "==", UserID).get();

  toSnapshot.docs.map((to) => {
    ret.push(to.data().From);
  });

  return ret;
};

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

  socket.on("all message", async (from, to) => {
    try {
      let responseBody = [];

      const chatRef = await chatsRef
        .where("From", "==", from)
        .where("To", "==", to)
        .get();
      chatRef.docs.map((doc) => {
        responseBody.push(doc.data());
      });

      const reverseRef = await chatsRef
        .where("To", "==", from)
        .where("From", "==", to)
        .get();
      reverseRef.docs.map((doc) => {
        responseBody.push(doc.data());
      });

      socket.emit("all message", responseBody);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("create room", async (from, to) => {
    try {
      await chatRoomRef.add({ From: from, To: to });

      const toUserRef = await usersRef.where("Nickname", "==", to).get();
      const toUser = toUserRef.docs[0];

      const toRoomList = await getRoomList(toUser.id);
      io.to(toUser.data().socketId).emit("create room", toRoomList);

      const FromUserRef = await usersRef.where("Nickname", "==", from).get();
      const FromUser = FromUserRef.docs[0];

      const FromRoomList = await getRoomList(FromUser.id);
      socket.emit("create room", FromRoomList);
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = eventHandler;
