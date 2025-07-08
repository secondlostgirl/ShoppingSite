import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import PageContainer from "./container/PageContainer";
import Header from "./components/Header";
import RouterConfig from "./config/RouterConfig";
import Loading from "./components/Loading";

import { getAllProducts } from "./redux/slices/productSlice";
import { loadCartFromDB } from "./redux/slices/cartSlice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getAllProducts());

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.userId) {
      dispatch(loadCartFromDB(storedUser.userId));
    }
  }, [dispatch]);

  return (
    <>
      <PageContainer>
        {/* Giriş ekranında header gösterme */}
        {location.pathname !== "/" && <Header />}
        <RouterConfig />
      </PageContainer>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
}

export default App;
