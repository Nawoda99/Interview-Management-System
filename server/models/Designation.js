const { db } = require("../config/firebase");
const DESIGNATIONS_COLLECTION = "designations";

const Designation = {
  async createDesignation(designationData) {
    const docRef = await db
      .collection(DESIGNATIONS_COLLECTION)
      .add(designationData);
    return { id: docRef.id, ...designationData };
  },
  async getDesignationById(designationId) {
    const doc = await db
      .collection(DESIGNATIONS_COLLECTION)
      .doc(designationId)
      .get();
    if (!doc.exists) {
      throw new Error("Designation not found");
    }
    return { id: doc.id, ...doc.data() };
  },
  async getAllDesignations() {
    const snapshot = await db.collection(DESIGNATIONS_COLLECTION).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
  async updateDesignation(designationId, updateData) {
    await db
      .collection(DESIGNATIONS_COLLECTION)
      .doc(designationId)
      .update(updateData);
    return this.getDesignationById(designationId);
  },
  async deleteDesignation(designationId) {
    await db.collection(DESIGNATIONS_COLLECTION).doc(designationId).delete();
    return true;
  },
};

module.exports = Designation;
