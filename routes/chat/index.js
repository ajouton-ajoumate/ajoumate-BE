const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const chatsRef = db.collection("chat");
const usersRef = db.collection("user");

const eventHandler = (io, socket) => {
    socket.on("message", async (data) => {
        await chatsRef.add(data);
        const userRef = await usersRef.doc(data.To).get();

        
    })
}

module.exports = eventHandler;