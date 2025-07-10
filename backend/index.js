import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

import cartRoutes from './routes/cart.js';
import authRoutes from "./routes/auth.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ DÜZELTİLDİ

import Product from './models/Product.js';
import reviewRoutes from "./routes/review.js";
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ROUTES
app.use("/api/cart", cartRoutes);
app.use("/api", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/users", userRoutes); // ✅ endpoint düzeltildi: /api/user → /api/users
app.use("/api/reviews", reviewRoutes);

// MongoDB BAĞLANTISI
mongoose.connect('mongodb://localhost:27017/shopping', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.log("MongoDB bağlantı hatası:", err));

// ÜRÜN YÜKLEME ENDPOINTİ
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GEÇİCİ TEST ÜRÜNLERİ
(async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    const testProducts = [
      {
        title: "Pink Bag",
        price: 49.99,
        description: "A cute pink bag",
        category: "accessories",
        image: ["product1.jpg"],
      },
      {
        title: "Heart Earrings",
        price: 19.99,
        description: "Stylish earrings",
        category: "jewelry",
        image: ["product2.jpg", "products3.jpg"],
      },
    ];
    await Product.insertMany(testProducts);
    console.log("✔ Test ürünleri eklendi");
  } else {
    console.log("✔ Ürünler zaten var, tekrar eklenmedi");
  }
})();

// SUNUCU BAŞLAT
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
