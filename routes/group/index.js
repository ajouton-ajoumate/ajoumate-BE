const router = require("express").Router();
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const groupsRef = db.collection("group");
const consistOfRef = db.collection("consistOf");

const createConsistOf = async (UserID) => {
  let userArray = [];

  userArray.push(UserID);

  const addResponse = consistOfRef.add(userArray);

  return addResponse.id;
};

router.post("/new", async (req, res, next) => {
  try {
    let group = req.body;

    const ConsistOfID = createConsistOf(group.UserID);
    group.ConsistOfID = ConsistOfID;
    group.NumberOfPeople = 1;

    const addResponse = await groupsRef.add(group);

    let responseBody = group;
    responseBody.GroupID = addResponse.id;
    responseBody.Status = true;

    res.send(responseBody);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.get("/all", async (req, res, next) => {
  try {
    const snapshot = await groupsRef.get();
    let responseBody = [];

    snapshot.forEach((doc) => {
      let response = doc.data();
      response.GroupID = doc.id;

      responseBody.push(response);
    });

    res.send(responseBody);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
});

router.get("/category/recent", async (req, res) => {});

router.get("/category", async (req, res) => {});

router.post("/join", async (req, res) => {});

router.delete("/", async (req, res) => {});

router.get("/", async (req, res) => {});

module.exports = router;
