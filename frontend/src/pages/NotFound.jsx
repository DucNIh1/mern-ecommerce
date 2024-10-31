import { Link } from "react-router-dom";
import notfound from "../assets/frontend_assets/404.svg";

const NotFound = () => {
  return (
    <section className="h-screen bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-sm mx-auto text-center">
          <img src={notfound} alt="" className="w-[70%] mx-auto" />
          <p className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            NOT FOUND PAGE.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.{" "}
          </p>
          <Link
            to="/"
            className="hover:bg-opacity-20 hover:text-white inline-flex text-gray-800  hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-primary-900 my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
