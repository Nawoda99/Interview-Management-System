const { db } = require("../config/firebase");
const Sessions = require("./Session");
const APPLICANTS_COLLECTION = "applicants";

const Applicants = {
  async create(applicantData) {
    const applicantRef = db.collection(APPLICANTS_COLLECTION).doc();
    await applicantRef.set({
      ...applicantData,
      Qualifications: applicantData.Qualifications || [],
      Experience: applicantData.Experience || [],
      CV: applicantData.CV || "",
      ProfileImage: applicantData.ProfileImage || "",
    });
    return applicantRef.id;
  },

  async findById(applicantId) {
    if (!applicantId) {
      throw new Error("Invalid applicantId");
    }
    const applicantRef = db.collection(APPLICANTS_COLLECTION).doc(applicantId);
    const applicantSnapshot = await applicantRef.get();
    if (!applicantSnapshot.exists) {
      throw new Error("Applicant not found");
    }
    const applicantData = {
      id: applicantSnapshot.id,
      ...applicantSnapshot.data(),
    };
    console.log("Fetched applicant data:", applicantData.InterviewSessionID);

    if (
      applicantData.InterviewSessionID &&
      typeof applicantData.InterviewSessionID === "string" &&
      applicantData.InterviewSessionID.trim() !== ""
    ) {
      const interviewSessionSnapshot = await Sessions.findByID(
        applicantData.InterviewSessionID
      );
      applicantData.interviewSession = interviewSessionSnapshot
        ? { id: interviewSessionSnapshot.id, ...interviewSessionSnapshot }
        : null;
    } else {
      applicantData.interviewSession = null;
    }
    return applicantData;
  },

  async find() {
    const applicantsSnapshot = await db.collection(APPLICANTS_COLLECTION).get();
    const applicants = await Promise.all(
      applicantsSnapshot.docs.map(async (doc) => {
        const applicantData = { id: doc.id, ...doc.data() };
        if (applicantData.InterviewSessionID) {
          const interviewSessionRef = db
            .collection("Sessions")
            .doc(applicantData.InterviewSessionID);
          const interviewSessionSnapshot = await interviewSessionRef.get();
          if (interviewSessionSnapshot.exists) {
            applicantData.interviewSession = {
              id: interviewSessionSnapshot.id,
              ...interviewSessionSnapshot.data(),
            };
          } else {
            applicantData.interviewSession = null;
          }
        }
        return applicantData;
      })
    );
    return applicants;
  },

  async update(applicantId, updateData) {
    const applicantRef = db.collection(APPLICANTS_COLLECTION).doc(applicantId);
    await applicantRef.update(updateData);
  },

  async delete(applicantId) {
    const applicantRef = db.collection(APPLICANTS_COLLECTION).doc(applicantId);
    await applicantRef.delete();
  },
};

module.exports = Applicants;
