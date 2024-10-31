import { useState } from "react";

import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";

import Paganation from "../../components/Paganation";
import ProductCard from "../../components/ProductCard";

const Collection = () => {
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [category, setCategory] = useState([]);
  const [target, setTarget] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 6;

  // State tạm thời cho các giá trị filter (trước khi ấn nút "Lọc")
  const [tempMinPrice, setTempMinPrice] = useState(null);
  const [tempMaxPrice, setTempMaxPrice] = useState(null);

  // API product
  const { data: categoryData } = useGetCategoriesQuery();
  const { data: productData, isLoading } = useGetProductsQuery({
    page,
    limit,
    ...{ isActive: true },
    ...(minPrice ? { "price[gte]": minPrice } : {}),
    ...(maxPrice ? { "price[lte]": maxPrice } : {}),
    ...(category.length > 0 ? { category: category.join(",") } : {}),
    ...(target.length > 0 ? { target: target.join(",") } : {}),
  });

  // total pages
  const totalPages = productData?.totalPages;

  const handleFilterPrice = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setPage(1);
  };

  const handleTargetChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setTarget((prev) => [...prev, value]);
      setPage(1);
    } else {
      setTarget((prev) => prev.filter((item) => item !== value));
      setPage(1);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategory((prev) => [...prev, value]);
      setPage(1);
    } else {
      setCategory((prev) => prev.filter((item) => item !== value));
      setPage(1);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[800px]">
        <div className="mx-auto border-[5px] border-red-500 rounded-full w-36 h-36 border-t-transparent animate-spin mt-36"></div>
      </div>
    );
  }
  return (
    <div className="my-20">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:pr-8 lg:w-1/4">
          <h2 className="mb-8 text-2xl leading-7 tracking-wide">
            LỌC SẢN PHẨM
          </h2>

          <div className="flex flex-col gap-2 p-5 mb-8 border border-slate-300">
            <h3 className="mb-2 text-lg font-medium">Danh mục</h3>
            {categoryData?.categories.map((cat, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={cat.name}
                  className="mr-2 cursor-pointer"
                  value={cat._id || ""}
                  onChange={handleCategoryChange}
                />
                <label htmlFor={cat.name}>{cat.name}</label>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 p-5 mb-8 border border-slate-300 ">
            <h3 className="mb-2 text-lg font-medium ">Đối tượng</h3>
            <div className="">
              <input
                type="checkbox"
                id="nam"
                value="Nam"
                className="mr-2 cursor-pointer"
                onChange={handleTargetChange}
              />
              <label htmlFor="nam">Nam</label>
            </div>
            <div className="">
              <input
                type="checkbox"
                id="nu"
                value="Nữ"
                className="mr-2 cursor-pointer"
                onChange={handleTargetChange}
              />
              <label htmlFor="nu">Nữ</label>
            </div>
            <div className="">
              <input
                type="checkbox"
                id="treem"
                value="Trẻ em"
                className="mr-2 cursor-pointer"
                onChange={handleTargetChange}
              />
              <label htmlFor="treem">Trẻ em</label>
            </div>
            <div className="">
              <input
                type="checkbox"
                id="Unisex"
                value="Unisex"
                className="mr-2 cursor-pointer"
                onChange={handleTargetChange}
              />
              <label htmlFor="Unisex">Unisex</label>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-5 border border-slate-300">
            <h3 className="mb-2 text-lg font-medium ">Giá tiền</h3>
            <input
              type="number"
              value={tempMinPrice || ""}
              onChange={(e) => setTempMinPrice(e.target.value)}
              name="minPrice"
              id="minPrice"
              placeholder="Giá tối thiểu"
              className="p-4 border outline-none"
            />
            <input
              type="number"
              value={tempMaxPrice || ""}
              onChange={(e) => setTempMaxPrice(e.target.value)}
              name="maxPrice"
              id="maxPrice"
              placeholder="Giá tối đa"
              className="p-4 border outline-none"
            />
            <button
              onClick={handleFilterPrice}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none  font-medium  text-sm px-5 py-2.5  mb-2 "
            >
              Lọc giá
            </button>
          </div>
        </div>

        <div className="relative flex flex-col mt-10 lg:w-3/4 lg:mt-0">
          <div className="flex flex-col items-center justify-between mb-8 lg:flex-row">
            <h1 className="flex items-center gap-2 mb-4 text-2xl font-medium uppercase">
              <span className="text-gray-500 text-[24px]">Tất cả</span>
              <span>Sản phẩm</span>
              <span className="block w-14 h-[2px] bg-slate-700"></span>
            </h1>
            <div>
              <label htmlFor="sort" className="mr-2">
                Sort by:
              </label>
              <select id="sort" className="p-2 border border-gray-300">
                <option>Relevent</option>
              </select>
            </div>
          </div>

          {/* Product list */}
          <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
            {productData?.products.length > 0 ? (
              productData.products.map((product, index) => (
                <ProductCard product={product} key={index} />
              ))
            ) : (
              <h1>Không có sản phẩm nào</h1>
            )}
          </div>

          {/* Pagination */}
          <Paganation totalPages={totalPages} page={page} setPage={setPage} />
        </div>
      </div>
    </div>
  );
};

export default Collection;
