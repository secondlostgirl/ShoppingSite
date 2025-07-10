import express from "express";
import Review from "../models/Review.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Tüm yorumları getir
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "firstName lastName");
    res.json(reviews);
  } catch (err) {
    console.error("Yorumları alma hatası:", err);
    res.status(500).json({ error: "Yorumlar alınamadı" });
  }
});

// ✅ Yeni yorum oluştur
router.post("/:productId", async (req, res) => {
  const { userId, rating, comment } = req.body;

  if (!userId || !rating || !comment) {
    return res.status(400).json({ error: "Eksik veri gönderildi." });
  }

  try {
    const newReview = new Review({
      product: req.params.productId,
      user: userId,
      rating,
      comment,
      createdAt: new Date(),
    });

    await newReview.save();

    const populatedReview = await newReview.populate("user", "firstName lastName");
    res.status(201).json(populatedReview);
  } catch (err) {
    console.error("Yorum ekleme hatası:", err);
    res.status(500).json({ error: "Yorum eklenemedi" });
  }
});
router.get("/user/:userId", async (req, res) => {
  try {

    const reviews = await Review.find({ user: req.params.userId })
      .populate("product", "title image")
      .sort({ createdAt: -1 });


    res.json(reviews);
  } catch (err) {
    console.error("Kullanıcı yorumları getirilemedi:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
