import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  },
  selectedSize: {
    type: String,
    default: "standard",
  },
});

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [cartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
