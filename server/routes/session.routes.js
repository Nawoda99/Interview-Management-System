const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const SessionController = require("../controllers/Session.controllers");

router.post("/", SessionController.createSession);
router.get("/", SessionController.getAllSessions);
router.get("/:id", SessionController.getSessionById);
router.put("/:id", SessionController.updateSession);

module.exports = router;
