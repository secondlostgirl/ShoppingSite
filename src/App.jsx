import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PageContainer from "./container/PageContainer";
import "./App.css";
import Header from "./components/Header";
import RouterConfig from "./config/RouterConfig";
import Loading from "./components/Loading";
import { ToastContainer } from "react-toastify";
import { getAllProducts } from "./redux/slices/productSlice";
import { loadCartFromDB } from "./redux/slices/cartSlice"; // 🔥 ÖNEMLİ: Sepeti yüklemek için
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());

    // 🔐 Kullanıcı giriş yaptıysa sepetteki ürünleri getir
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.userId) {
      dispatch(loadCartFromDB(storedUser.userId));
    }
  }, [dispatch]);

  return (
    <>
      <PageContainer>
        <Header />
        <RouterConfig />
      </PageContainer>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
}

export default App;
