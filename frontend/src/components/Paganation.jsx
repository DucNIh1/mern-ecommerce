/* eslint-disable react/prop-types */

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Paganation = ({ totalPages, page, setPage }) => {
  return (
    <div className="flex items-end justify-center flex-1 px-4 py-3 bg-white ">
      <div>
        <nav
          aria-label="Pagination"
          className="inline-flex gap-5 rounded-md shadow-sm isolate"
        >
          {/* Previous button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 outline-none rounded-l-md hover:text-white hover:bg-red-900 focus:z-20 "
          >
            <span className="sr-only">Previous</span>
            <FaChevronLeft aria-hidden="true" className="w-5 h-5" />
          </button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`outline-none relative inline-flex items-center px-4 py-2 text-[16px] font-semibold rounded-sm ${
                page === index + 1
                  ? "text-white bg-red-900"
                  : "text-gray-900 hover:text-white hover:bg-red-900"
              } focus:z-20 `}
            >
              {index + 1}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 outline-none cursor-pointer rounded-r-md hover:text-white hover:bg-red-900 focus:z-20 "
          >
            <span className="sr-only">Next</span>
            <FaChevronRight aria-hidden="true" className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Paganation;
