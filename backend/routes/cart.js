import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

// Sepeti getir
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    res.status(200).json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

// Sepete ürün ekle
router.post('/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error saving cart' });
  }
});

// Sepeti temizle
router.post('/clear', async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ message: 'Sepet temizlendi' });
  } catch (err) {
    res.status(500).json({ message: 'Sepet silinemedi' });
  }
});
// Ürünün miktarını güncelle
router.patch('/update', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Quantity updated" });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Sepetten ürün sil
router.post('/remove', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed" });
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// ⬅️ Bu satır çok önemli! Başka türlü import edemezsin.
export default router;
