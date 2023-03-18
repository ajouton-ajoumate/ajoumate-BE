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

    const addResponse = await groupsRef.add(group);
    await createConsistOf(addResponse.id, group.UserID);
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

router.get("/category/recent", async (req, res) => {
  try {
    let responseBody = [];

    const promise = CATEGORY_TYPE.map(async (category) => {
      const snapshot = await groupsRef.where("Category", "==", category).get();

      let groups = [];
      snapshot.docs.map((doc) => {
        let group = doc.data();
        group.Category = category;

        groups.push(group);
      });

      groups.sort((a, b) => {
        return a.Date - b.Date;
      });

      responseBody.push(groups[0]);
    });

    await Promise.all(promise);

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

    let responseBody = [];
    
    groups.docs.map((doc)=> {
        let group = doc.data();
        group.GroupID = doc.id;

        responseBody.push(group);
    })

    res.send(responseBody);
  } catch (err) {
    console.log(err);
    res.status(503);
    res.send(err);
  }
});

router.post("/join", async (req, res) => {
  try {
    const { GroupID, UserID } = req.query;
    console.log(GroupID, UserID);

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
    await consistOfRef.doc(GroupID).set({Users: users});

    //join
    const join = await joinsRef.doc(UserID).get();
    const groups = join.data().Groups;
    groups.push(GroupID);
    await joinsRef.doc(UserID).set({Groups: groups});

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
