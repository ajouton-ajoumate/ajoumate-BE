const router = require("express").Router();
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore();
const usersRef = db.collection("user");

router.post("/signup", async (req, res, next) => {
  try {
    const user = req.body;
    const addResponse = await usersRef.add(user);

    console.log("Added document with ID: ", addResponse.id);

    let responseBody = user;
    responseBody.userID = addResponse.id;

    res.send(responseBody);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.post("/signin", async (req, res, next) => {

});

router.post("/checkDuplicateID", async (req, res) => {
  try {
    const ID = req.body.ID;

    const userRef = await usersRef.where("ID", "==", ID).get();

    let response = {};

    response.Status = userRef.empty

    res.send(response);
  } catch(err) {
    console.log(err);
    res.send(err);
  }
});

router.post("/checkDuplicateName", async (req, res, next) => {});

module.exports = router;
