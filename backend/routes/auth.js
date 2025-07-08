import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Kayıt olma endpoint'i (şifre hash'li)
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 🔐 Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // <- hash'li olarak kaydediliyor
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});



export default router;
