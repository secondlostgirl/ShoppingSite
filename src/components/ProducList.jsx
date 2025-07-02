import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../redux/slices/productSlice';
import Product from './Product'; // ✅ bileşeni doğru import et
import '../css/ProductList.css'; 

function ProductList() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

 return (
  <div className="product-list">
    {products && products.map((product) => (
      <Product key={product.id} product={product} />
    ))}
  </div>
);

}

export default ProductList;
