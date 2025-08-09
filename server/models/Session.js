const { db } = require("../config/firebase");
const SESSIONS_COLLECTION = "sessions";
const Designation = require("./Designation");

const Sessions = {
  async create(sessionData) {
    const sessionRef = db.collection(SESSIONS_COLLECTION).doc();
    await sessionRef.set(sessionData);
    return sessionRef.id;
  },
  async findByID(sessionId) {
    const sessionRef = db.collection(SESSIONS_COLLECTION).doc(sessionId);
    const sessionSnapshot = await sessionRef.get();
    if (!sessionSnapshot.exists) {
      throw new Error("Session not found");
    }
    const sessionData = { id: sessionSnapshot.id, ...sessionSnapshot.data() };
    if (sessionData.DesignationID) {
      try {
        const designation = await Designation.getDesignationById(
          sessionData.DesignationID
        );
        sessionData.designation = designation;
      } catch (error) {
        console.error("Error fetching designation:", error);
        sessionData.designation = null;
      }
    }
    return sessionData;
  },
  // Make sure to import your Designation model

  async find() {
    const sessionsSnapshot = await db.collection(SESSIONS_COLLECTION).get();
    const sessions = await Promise.all(
      sessionsSnapshot.docs.map(async (doc) => {
        const sessionData = { id: doc.id, ...doc.data() };
        if (sessionData.DesignationID) {
          try {
            const designation = await Designation.getDesignationById(
              sessionData.DesignationID
            );
            sessionData.designation = designation;
          } catch (e) {
            sessionData.designation = null; // or handle error as needed
          }
        }
        return sessionData;
      })
    );
    return sessions;
  },
  async updateSession(sessionId, updateData) {
    const sessionRef = db.collection(SESSIONS_COLLECTION).doc(sessionId);
    await sessionRef.update(updateData);
  },

  async deleteSession(sessionId) {
    const sessionRef = db.collection(SESSIONS_COLLECTION).doc(sessionId);
    await sessionRef.delete();
  },
};

module.exports = Sessions;
