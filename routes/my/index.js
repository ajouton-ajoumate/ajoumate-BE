const router = require("express").Router();
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const joinsRef = db.collection("join");
const consistOfRef = db.collection("consistOf");
const groupsRef = db.collection("group");
const userRef = db.collection("user");

router.get("/", async (req, res) => {
  try {
    const userId = req.query.UserID;

    const user = await userRef.doc(userId).get();

    res.send(user.data());
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

router.get("/join", async (req, res) => {
  try {
    const UserID = req.query.UserID;

    const joinList = await joinsRef.doc(UserID).get();

    let responseBody = [];

    groups = joinList.data().Groups.slice(1);

    const promise = groups.map(async (GroupID) => {
      const groupSnapshot = await groupsRef.doc(GroupID).get();
      //   const consistOf = await consistOfRef.doc(GroupID).get();
      //   group.ConsistOf = consistOf;
      let group = groupSnapshot.data();
      group.GroupID = GroupID;

      responseBody.push(group);
    });

    await Promise.all(promise);

    res.send({Groups: responseBody});
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

router.get("/apply", async (req, res) => {
  try {
    const UserID = req.query.UserID;

    const applyList = await groupsRef.where("UserID", "==", UserID).get();

    let responseBody = [];

    applyList.docs.map((doc) => {
      let group = doc.data();
      group.GroupID = doc.id;

      responseBody.push(group);
    });

    res.send(responseBody);
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

module.exports = router;
