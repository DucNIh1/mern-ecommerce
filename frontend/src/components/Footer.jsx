import { Link } from "react-router-dom";
import logo from "../../../assets/frontend_assets/logo.png";

const Footer = () => {
  return (
    <>
      <div className="lg:grid lg:grid-cols-4 flex flex-col items-start gap-5 mx-auto">
        <div className="col-span-2">
          <img src={logo} alt="" className="leading-6 w-36 mb-5" />
          <p className="text-[#4b5563] text-sm leading-5 max-w-[450px]">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi
            quaerat quasi, incidunt nihil placeat minima iure unde facilis
            officia sunt quas culpa similique tempora voluptatem qui atque sequi
            eos pariatur.
          </p>
        </div>
        <div className="lg:col-span-1 ">
          <h1 className="text-[20px] uppercase font-medium mb-5">Công ty</h1>
          <ul className="text-sm leading-5 lg:flex lg:flex-col text-[#4b5563] gap-2">
            <Link>Trang chủ</Link>
            <Link>Thông tin về chúng tôi</Link>
            <Link>Vận chuyển</Link>
            <Link>Chính sách bảo mật</Link>
          </ul>
        </div>
        <div className="col-span-1 mb-10">
          <h1 className="text-[20px] uppercase font-medium mb-5">Liên hệ</h1>
          <ul className="text-sm leading-5 lg:flex lg:flex-col text-[#4b5563] gap-2">
            <Link>+84-36-99-36-010</Link>
            <Link>ducninh10x03@gmail.com</Link>
            <Link>Instagram</Link>
          </ul>
        </div>
      </div>
      <p className="border-t border-[#4b5563] border-opacity-40 py-5 text-center text-sm">
        Copyright 2024@ ducninh - All Right Reserved.
      </p>
    </>
  );
};

export default Footer;
