import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import User from './models/User.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/shopping', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.log("MongoDB bağlantı hatası:", err));

// Kayıt olma endpoint'i
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Giriş yapma endpoint'i
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});
// GEÇİCİ OLARAK BİRKEZLİK KULLAN
import Product from './models/Product.js';

// Test verilerini eklemek için IIFE fonksiyonu
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
