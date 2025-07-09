import User from "../models/User.js";
import bcrypt from "bcrypt";

// ✏️ PROFİL GÜNCELLE
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { email, phone, address } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, phone, address },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Profil güncellenemedi." });
  }
};

// 🔐 ŞİFRE GÜNCELLE
export const changePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Şifre başarıyla güncellendi." });
  } catch (err) {
    res.status(500).json({ message: "Şifre güncellenemedi." });
  }
};
