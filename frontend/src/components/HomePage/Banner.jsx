import { Link } from "react-router-dom";
import bannerImg from "../../assets/frontend_assets/hero_img.png";

const Banner = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row h-[500px] border mt-5 my-20">
        <div className="flex flex-col items-center justify-center flex-1 gap-5">
          <h2 className="uppercase text-[#414141] font-medium leading-6">
            Our bestsellers
          </h2>
          <h1 className="text-4xl lg:text-5xl"> Latest Arrivals</h1>
          <Link
            to="/collections"
            className="uppercase transition-all duration-100 ease-in-out hover:text-red-800 hover:scale-110"
          >
            Shop now
          </Link>
        </div>
        <img src={bannerImg} alt="" className="flex-1 object-cover" />
      </div>
    </>
  );
};

export default Banner;
