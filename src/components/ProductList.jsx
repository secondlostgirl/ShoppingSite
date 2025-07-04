import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/slices/productSlice";
import Product from "./Product"; // ✅ bileşeni doğru import et
import "../css/ProductList.css";

function ProductList() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((store) => store.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="product-list">
      {products &&
        products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
    </div>
  );
}

export default ProductList;
