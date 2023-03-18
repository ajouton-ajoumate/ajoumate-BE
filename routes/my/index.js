const router = require("express").Router();
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const joinsRef = db.collection("join");
const groupsRef = db.collection("group");
const userRef = db.collection("user");

router.get("/", async (req, res) => {
    try {
        
    } catch(err) {

    }
});

router.post("/join", async (req, res) => {
  try {
    const UserID = req.body.UserID;

    console.log(req.body, UserID);

    const joinList = await joinsRef.doc(UserID).get();
    let responseBody = {};
    responseBody.Groups = [];

    console.log(joinList.data());

    // joinList.data()((GroupID) => {
    //   const group = groupsRef.doc(GroupID).get();
    //   responseBody.Groups.push(group);
    // });

    res.send(responseBody);
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

router.get("/apply", async (req, res) => {});

module.exports = router;
