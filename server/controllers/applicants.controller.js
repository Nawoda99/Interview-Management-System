const Applicants = require("../models/Applicants");
const admin = require("firebase-admin");
const db = admin.firestore();

const ApplicantsController = {
  async createApplicant(req, res) {
    try {
      const applicantData = req.body;
      const applicantId = await Applicants.create(applicantData);
      res.status(201).json({ id: applicantId });
    } catch (error) {
      console.error("Error creating applicant:", error);
      res.status(500).json({ error: "Failed to create applicant" });
    }
  },
  async getApplicantById(req, res) {
    const { id } = req.params;
    try {
      const applicant = await Applicants.findById(id);
      res.status(200).json(applicant);
    } catch (error) {
      console.error("Error fetching applicant:", error);
      res.status(404).json({ error: "Applicant not found" });
    }
  },
};

module.exports = ApplicantsController;
