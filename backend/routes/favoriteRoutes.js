import express from "express";
import Favorite from "../models/Favorite.js";

const router = express.Router();

// Add to favorites
router.post("/add", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    console.log(userId)
    const exists = await Favorite.findOne({ userId, productId });
    if (exists) return res.status(200).json({ message: "Already favorited" });

    const newFav = new Favorite({ userId, productId });
    await newFav.save();
    res.status(201).json(newFav);
  } catch (err) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Remove from favorites
router.post("/remove", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await Favorite.deleteOne({ userId, productId });
    res.status(200).json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// Get all favorites
router.get("/:userId", async (req, res) => {
  try {
    console.log("req")
    const favorites = await Favorite.find({ userId: req.params.userId });
    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

export default router;
