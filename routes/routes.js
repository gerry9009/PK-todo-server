const express = require("express");

const router = express.Router();

// Import controllers
const getAll = require("../controllers/get.controller");
const getByID = require("../controllers/getID.controller");
const patchByID = require("../controllers/patch.controller");
const postByID = require("../controllers/post.controller");
const deleteByID = require("../controllers/delete.controller");

router.get("/", getAll);
router.get("/:id", getByID);
router.post("/", postByID);
router.patch("/:id", patchByID);
router.delete("/:id", deleteByID);

module.exports = router;
