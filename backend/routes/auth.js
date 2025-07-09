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
// routes/auth.js
router.post("/register", async (req, res) => {
  try {
    console.log("➡️ Kayıt isteği alındı:");
    console.log(req.body); // ✅ Gelen veriyi gör

    const { firstName, lastName, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ Şifre hashleniyor

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Register error:", err); // ✅ Hata detayı
    res.status(500).json({ message: "Internal Server Error" });
  }
});



export default router;
