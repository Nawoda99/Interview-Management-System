const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const ApplicantsController = require("../controllers/applicants.controller");

router.post("/", ApplicantsController.createApplicant);
router.get("/:id", ApplicantsController.getApplicantById);

module.exports = router;
