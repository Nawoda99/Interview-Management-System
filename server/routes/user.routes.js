const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const UserController = require("../controllers/user.Controller");

router.post("/", authenticateToken, UserController.createUser);
router.get("/", authenticateToken, UserController.getAllUsers);
router.get("/:id", authenticateToken, UserController.getUser);
router.put("/:id", authenticateToken, UserController.updateUser);
router.delete("/:id", authenticateToken, UserController.deleteUser);
router.post("/login", UserController.login);
router.post(
  "/updatePassword",
  authenticateToken,
  UserController.changePassword
);

module.exports = router;
