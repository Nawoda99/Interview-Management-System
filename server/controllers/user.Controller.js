const User = require("../models/User");
const admin = require("firebase-admin");
const db = admin.firestore();
const axios = require("axios");

const { FIREBASE_API_KEY } = process.env;

const UserController = {
  async createUser(req, res) {
    const { email, password, username, mobileNumber, role, employeeID } =
      req.body;
    try {
      const userSnap = await db
        .collection("users")
        .where("username", "==", username)
        .get();
      if (!userSnap.empty) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: username,
      });

      const userData = {
        username,
        email,
        mobileNumber,
        role,
        employeeID,
        uid: userRecord.uid,
      };
      await db.collection("users").doc(userRecord.uid).set(userData);

      res.status(201).json({ message: "User created", uid: userRecord.uid });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const userSnap = await db
        .collection("users")
        .where("username", "==", username)
        .get();
      if (userSnap.empty) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      const user = userSnap.docs[0].data();
      const email = user.email;

      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );
      res.json({
        status: 200,
        user: user,
        idToken: response.data.idToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
        uid: response.data.localId,
      });
    } catch (err) {
      res.status(401).json({ error: "Invalid username or password" });
    }
  },
  async getUser(req, res) {
    try {
      const user = await User.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async updateUser(req, res) {
    try {
      const user = await User.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async deleteUser(req, res) {
    try {
      await User.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async changePassword(req, res) {
    const { uid, currentPassword, newPassword } = req.body;
    try {
      const userRecord = await admin.auth().getUser(uid);
      const email = userRecord.email;

      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
          email,
          password: currentPassword,
          returnSecureToken: false,
        }
      );
      if (response.status === 200) {
        await admin.auth().updateUser(uid, { password: newPassword });
        res.status(200).json({ message: "Password updated successfully" });
      }
    } catch (err) {
      res.status(400).json({ error: "Current password is incorrect." });
    }
  },
};

module.exports = UserController;
