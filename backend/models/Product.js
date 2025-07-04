import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  image: [String],  // 🔧 BURASI DÜZELTİLDİ
  category: String,
  stock: Number
});

const Product = mongoose.model('Product', productSchema);

export default Product;
