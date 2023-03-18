const router = require("express").Router();
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const groupsRef = db.collection("group");
const consistOfRef = db.collection("consistOf");
const joinsRef = db.collection("join");

const CATEGORY_TYPE = ["TAXI", "MEAL", "LOCKER", "CAFE", "ETC"];

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

    console.log(group);

    const addResponse = await groupsRef.add(group);
    const ConsistOfID = await createConsistOf(addResponse.id, group.UserID);
    group.ConsistOfID = ConsistOfID;
    group.NumberOfPeople = 1;

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
    const category = req.query.Category;
    const groups = await groupsRef.where("Category", "==", category).get();

    res.send(groups);
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

router.post("/join", async (req, res) => {
  try {
    const { GroupID, UserID } = req.query;

    //numberOfPeople
    const group = await groupsRef.doc(GroupID).get();
    const groupData = group.data();
    if (groupData.NumberOfPeople === groupData.MaximumNumberOfPeople) {
      throw new Error("group is full");
    }
    groupData.NumberOfPeople++;
    await groupsRef.doc(GroupID).set(groupData);

    //consistOf
    let users = await getConsistOf(GroupID);
    users.push(UserID);
    await consistOfRef.doc(GroupID).set(users);

    //join
    const join = await joinsRef.doc(UserID).get();
    const groups = join.data().Groups;
    groups.push(GroupID);
    await joinsRef.doc(UserID).set(groups);

    res.send({ Status: true });
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

router.delete("/", async (req, res) => {
  try {
    const { GroupID } = req.query;

    await groupsRef.doc(GroupID).delete();
    res.send({ Status: true });
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const { GroupID } = req.query;

    const group = await groupsRef.doc(GroupID).get();

    res.send(group.data());
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

module.exports = router;
