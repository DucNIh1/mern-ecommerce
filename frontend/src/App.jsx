import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <div className="px-10 lg:px-32">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default App;
