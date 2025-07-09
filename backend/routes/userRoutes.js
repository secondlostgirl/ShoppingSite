import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// 📌 Kullanıcı bilgilerini güncelle
router.put("/update/:userId", async (req, res) => {
  try {
    const { email, phone, address } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      { email, phone, address },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 🔐 Şifre değiştir (bcrypt ile kontrol + hash)
router.put("/password/:userId", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Password update failed" });
  }
});

// 👤 Kullanıcı bilgilerini getirme
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "User not found" });
  }
});

export default router;
