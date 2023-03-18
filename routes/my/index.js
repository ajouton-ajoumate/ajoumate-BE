const router = require("express").Router();
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const joinsRef = db.collection("join");

router.get("/", async (req, res) => {});

router.get("/join", async (req, res) => {});

router.get("/apply", async (req, res) => {});

module.exports = router;
