const Sessions = require("../models/Session");
const admin = require("firebase-admin");
const db = admin.firestore();

const SessionController = {
  async createSession(req, res) {
    const {
      SessionName,
      RequirementDesc,
      SessionStartDate,
      SessionEndDate,
      InterviewStartDate,
      ApplicationClosingDate,
      SessionStatus,
      InactiveDate,
      DesignationID,
      CreatedByID,
      ModifiedByID,
    } = req.body;

    try {
      const newSession = await Sessions.create({
        SessionName,
        RequirementDesc,
        SessionStartDate,
        SessionEndDate,
        InterviewStartDate,
        ApplicationClosingDate,
        SessionStatus,
        InactiveDate,
        DesignationID,
        CreatedByID,
        ModifiedByID,
      });
      res.status(201).json(newSession);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  },
  async getAllSessions(req, res) {
    try {
      const sessions = await Sessions.find();
      res.status(200).json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  },
  async getSessionById(req, res) {
    const { id } = req.params;
    try {
      const session = await Sessions.findByID(id);
      res.status(200).json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  },
  async updateSession(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    try {
      await Sessions.updateSession(id, updateData);
      res.status(200).json({ message: "Session updated successfully" });
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ error: "Failed to update session" });
    }
  },
};

module.exports = SessionController;
