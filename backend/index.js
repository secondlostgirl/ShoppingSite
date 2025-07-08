import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cartRoutes from './routes/cart.js';
import authRoutes from "./routes/auth.js"; // ✅ Login-register rotaları

import Product from './models/Product.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/cart", cartRoutes);
app.use("/api", authRoutes); // ✅ Login ve register burada olacak

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/shopping', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.log("MongoDB bağlantı hatası:", err));

// Ürünleri çekme endpoint'i
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GEÇİCİ OLARAK TEST VERİSİ EKLE
(async () => {
  const count = await Product.countDocuments();

  console.log(count)
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
        image: ["product2.jpg","products3.jpg"],
      },
    ];

    await Product.insertMany(testProducts);
    console.log("✔ Test ürünleri eklendi");
  } else {
    console.log("✔ Ürünler zaten var, tekrar eklenmedi");
  }
})();

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
