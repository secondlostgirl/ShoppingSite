import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
