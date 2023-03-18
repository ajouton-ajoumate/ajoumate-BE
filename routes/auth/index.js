const router = require("express").Router();
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const usersRef = db.collection("user");

router.post("/signup", async (req, res, next) => {
  try {
    const user = req.body;
    const addResponse = await usersRef.add(user);

    let responseBody = user;
    responseBody.UserID = addResponse.id;
    responseBody.Status = true;

    res.send(responseBody);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { ID, Password } = req.body;

    const snapshot = await usersRef
      .where("ID", "==", ID)
      .where("Password", "==", Password)
      .get();

    let response = {};

    response.Status = snapshot.size == 1;

    snapshot.forEach(doc => {
      response.Nickname = doc.data().Nickname;
    });

    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.post("/checkDuplicateID", async (req, res) => {
  try {
    const ID = req.body.ID;

    const userRef = await usersRef.where("ID", "==", ID).get();

    let response = {};

    response.Status = userRef.empty;

    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.post("/checkDuplicateName", async (req, res) => {
  try {
    const nickname = req.body.Nickname;

    const userRef = await usersRef.where("Nickname", "==", nickname).get();

    let response = {};

    response.Status = userRef.empty;

    res.send(response);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
