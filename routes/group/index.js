const router = require("express").Router();
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const usersRef = db.collection("user");

router.post("/new", async (req, res, next) => {});

router.get("/all", async (req, res, next) => {});

router.get("/category/recent", async (req, res) => {});

router.get("/category", async (req, res) => {});

router.post("/join", async (req, res) => {});

router.delete("/", async (req, res) => {});

router.get("/", async (req, res) => {});

module.exports = router;
