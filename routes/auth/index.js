const router = require("express").Router();

const db = getFirestore();
const userRef = db.collection("user");

router.post("/signup", async (req, res, next) => {
  try {
    let body = req.body;
    const res = await userRef.add(body);

    console.log("Added document with ID: ", res.id);
    body.userID = res.id;

    res.send(body);
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res, next) => {});

router.get("/checkDuplicateID", async (req, res, next) => {});

router.get("/checkDuplicateName", async (req, res, next) => {});

module.exports = router;
