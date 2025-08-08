const Designation = require("../models/Designation");
const admin = require("firebase-admin");
const db = admin.firestore();

const { FIREBASE_API_KEY } = process.env;

const DesignationController = {
  async createDesignation(req, res) {
    const { description, status, createdBy, updatedBy, updatedAt, createdAt } =
      req.body;

    try {
      const designationSnap = await db
        .collection("designations")
        .where("description", "==", description)
        .get();
      if (!designationSnap.empty) {
        return res.status(400).json({ error: "Designation already exists" });
      }
      const designationData = {
        description,
        status,
        createdBy,
        updatedBy,
        updatedAt,
        createdAt,
      };
      const designation = await Designation.createDesignation(designationData);
      res.status(201).json({ message: "Designation created", designation });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getAllDesignations(req, res) {
    try {
      const designations = await Designation.getAllDesignations();
      res.status(200).json(designations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getDesignationById(req, res) {
    const { id } = req.params;
    try {
      const designation = await Designation.getDesignationById(id);
      res.status(200).json(designation);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
  async updateDesignation(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const updatedDesignation = await Designation.updateDesignation(
        id,
        updateData
      );
      res.status(200).json(updatedDesignation);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
};
module.exports = DesignationController;
