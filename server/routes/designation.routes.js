const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const DesignationController = require("../controllers/Designation.Controller");

router.post("/", DesignationController.createDesignation);
router.get("/", DesignationController.getAllDesignations);
router.get("/:id", DesignationController.getDesignationById);
router.put("/:id", DesignationController.updateDesignation);

module.exports = router;
