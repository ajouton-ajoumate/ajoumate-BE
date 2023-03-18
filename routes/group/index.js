const router = require("express").Router();
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const groupsRef = db.collection("group");
const consistOfRef = db.collection("consistOf");

const CATEGORY_TYPE = ["TAXI", "EAT", "LOCKER", "ETC"];

const createConsistOf = async (GroupID, UserID) => {
  let userArray = [];

  userArray.push(UserID);

  const addResponse = await consistOfRef.doc(GroupID).set({ Users: userArray });

  return addResponse.id;
};

const getConsistOf = async (GroupID) => {
  const consistOf = await consistOfRef.doc(GroupID).get();

  return consistOf.data().Users;
};

router.post("/new", async (req, res, next) => {
  try {
    let group = req.body;

    const ConsistOfID = await createConsistOf(group.UserID);
    group.ConsistOfID = ConsistOfID;
    group.NumberOfPeople = 1;

    const addResponse = await groupsRef.add(group);

    let responseBody = group;
    responseBody.GroupID = addResponse.id;
    responseBody.Status = true;

    res.send(responseBody);
  } catch (err) {
    console.log(err);
    res.status(503);
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
    res.status(503);
    res.send(err);
  }
});

router.get("/category/recent", (req, res) => {
  try {
    let responseBody = [];

    CATEGORY_TYPE.forEach(async (category) => {
      const snapshot = await groupsRef
        .where("Category", "==", category)
        .orderBy("Date", "desc")
        .limit(1)
        .get();

      if (snapshot.size) {
        snapshot.forEach((doc) => {
          let response = doc.data();
          response.Category = category;

          responseBody.push(response);
        });
      }
    });

    res.send(responseBody);
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

router.get("/category", async (req, res) => {
  try {
    const category = req.params.Category;
    const groups = await groupsRef.where("Category", "==", category).get();

    res.send(groups);
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

router.post("/join", async (req, res) => {});

router.delete("/", async (req, res) => {});

router.get("/", async (req, res) => {});

module.exports = router;
