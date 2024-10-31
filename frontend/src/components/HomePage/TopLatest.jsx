import { useGetProductsQuery } from "../../redux/api/productApiSlice";
import ProductCard from "../ProductCard";

const TopLatest = () => {
  const { data: productData } = useGetProductsQuery({
    limit: 8,
    sort: "-createdAt",
  });

  return (
    <div className="mb-20">
      <div className="mb-10">
        <h1 className="mb-5 text-3xl font-normal text-center">
          <span className="text-slate-400">Sản phẩm</span>{" "}
          <span className="text-gray-700">Mới nhất</span>
        </h1>
        <p className="mb-5 text-center text-gray-600">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productData?.products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default TopLatest;
