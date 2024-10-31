import { useEffect, useState } from "react";

import axios from "axios";

import ZaloPay from "../../assets/frontend_assets/ZaloPay.png";

import { useGetCartQuery } from "../../redux/api/cartApiSlice";
import {
  useCreateOrderNormalMutation,
  useCreateOrderWithZaloPayMutation,
} from "../../redux/api/orderApiSlice";

import { toast } from "react-toastify";

const Checkout = () => {
  const [provincesData, setProvincesData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [wardsData, setWardsData] = useState([]);

  // Lấy value
  const [username, setUsername] = useState("");
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const [provine, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Thanh toán tiền mặt");
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  //API
  const { data: cartData, refetch } = useGetCartQuery();
  const [createOrderWithZaloPay] = useCreateOrderWithZaloPayMutation();
  const [createOrderNormal] = useCreateOrderNormalMutation();

  // Lấy danh sách tỉnh
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          `https://open.oapi.vn/location/provinces?size=63`
        );

        setProvincesData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProvinces();
  }, []);

  // Lấy danh sách quận/huyện khi người dùng chọn tỉnh
  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://open.oapi.vn/location/districts/${provinceId}?size=50`
      );
      setDistrictsData(response.data.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Lấy danh sách phường/xã khi người dùng chọn quận/huyện
  const fetchWards = async (districtId) => {
    console.log(districtId);
    try {
      const response = await axios.get(
        `https://open.oapi.vn/location/wards/${districtId}?size=50`
      );
      setWardsData(response.data.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  // Xử lý khi người dùng chọn một tỉnh fetch danh sách quận huyện theo id tỉnh
  const handleProvinceChange = (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const provinceId = selectedOption.getAttribute("data-id");
    setProvince(e.target.value);
    setDistrictsData([]);
    setWardsData([]);
    fetchDistricts(provinceId);
  };

  // Xử lý khi người dùng chọn một quận/huyện fetch danh sách xã theo id huyện
  const handleDistrictChange = (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const districtId = selectedOption.getAttribute("data-id");
    setDistrict(e.target.value);
    setWardsData([]);
    fetchWards(districtId);
  };

  useEffect(() => {
    const orderItems =
      cartData?.cart?.items &&
      cartData?.cart?.items.length > 0 &&
      cartData?.cart?.items.map((item) => ({
        product: item?.product?._id,
        size: item?.size,
        quantity: item?.quantity,
        price: item?.price,
      }));

    setItems(orderItems);
    setTotalPrice(cartData?.cart?.totalPrice);
  }, [cartData?.cart?.totalPrice, cartData?.cart?.items]);

  const handleCreateOrder = async () => {
    try {
      if (paymentMethod === "Thanh toán tiền mặt") {
        await createOrderNormal({
          username,
          street,
          phone,
          city: provine,
          district,
          ward,
          items,
          totalPrice,
          paymentMethod,
        }).unwrap();
        refetch();
        toast.success("Mua hàng thành công!");
      } else if (paymentMethod === "ZaloPay") {
        const res = await createOrderWithZaloPay({
          username,
          street,
          phone,
          city: provine,
          district,
          ward,
          items,
          totalPrice,
          paymentMethod,
        }).unwrap();
        refetch();

        if (res.order_url) {
          window.location.href = res.order_url;
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || "Đặt hàng không thành công");
      console.log(error);
    }
  };

  return (
    <div className="container flex flex-col gap-5 p-4 mx-auto my-20 lg:flex-row">
      <div className="flex-1">
        <div className="p-4 bg-white rounded shadow ">
          <h2 className="mb-4 text-lg font-semibold">Thông tin nhận hàng</h2>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  * Họ và tên
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full p-2 border rounded outline-none focus:border-red-800"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    * Số nhà, tên đường
                  </label>
                  <input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    type="text"
                    placeholder="Số nhà, tên đường"
                    className="w-full p-2 border rounded outline-none focus:border-red-800"
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    * Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại"
                    className="w-full p-2 border rounded outline-none focus:border-red-800"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-500">
                VUI LÒNG NHẬP THÔNG TIN CHÍNH XÁC ĐỂ CHÚNG TÔI GIAO HÀNG SỚM
                NHẤT CHO BẠN
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <select
                  onChange={handleProvinceChange}
                  defaultValue=""
                  className="w-full p-2 border rounded-md outline-none focus:border-red-800"
                >
                  <option value="" disabled>
                    Chọn Tỉnh/Thành Phố
                  </option>
                  {provincesData?.map((province) => (
                    <option
                      key={province.id}
                      value={province.name}
                      data-id={province.id}
                    >
                      {province.name}
                    </option>
                  ))}
                </select>

                {/* Dropdown chọn quận/huyện */}

                <select
                  onChange={handleDistrictChange}
                  defaultValue=""
                  className="w-full p-2 border rounded-md outline-none focus:border-red-800"
                >
                  <option value="" disabled>
                    Chọn Quận/Huyện
                  </option>
                  {districtsData.map((district) => (
                    <option
                      key={district.id}
                      value={district.name}
                      data-id={district.id}
                    >
                      {district.name}
                    </option>
                  ))}
                </select>

                {/* Danh sách phường/xã */}

                <select
                  onChange={(e) => setWard(e.target.value)}
                  defaultValue=""
                  className="w-full p-2 border rounded-md outline-none focus:border-red-800"
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wardsData.map((ward) => (
                    <option key={ward.id} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className="p-4 mt-4 bg-white rounded shadow">
          <div className="pt-4 border-t">
            {cartData?.cart?.items &&
              cartData?.cart?.items.length > 0 &&
              cartData?.cart?.items.map((item, index) => (
                <div className="flex items-center mb-4" key={index}>
                  <img
                    src={`${import.meta.env.VITE_API_URL}${
                      item?.product.images[0]
                    }`}
                    alt="Product Image"
                    className="w-20 h-20 mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-medium">
                      {item?.product?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {" "}
                      {new Intl.NumberFormat("vi-VN").format(
                        item?.product.price
                      )}{" "}
                      VND
                    </p>
                    <p className="text-sm text-gray-500">
                      Kích thước:{" "}
                      <span className="text-red-700">{item?.size}</span>
                    </p>

                    <p className="text-sm text-gray-500">
                      Số lượng: {item?.quantity}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h2 className="mb-4 text-lg font-semibold">Giá trị đơn hàng</h2>
        <div className="mb-4">
          <div className="flex justify-between mb-2 text-sm">
            <span>Thành tiền</span>
            <span className="font-medium">
              {new Intl.NumberFormat("vi-VN")
                .format(cartData?.cart?.totalPrice || 0)
                .replace(".", ",")}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Phí vận chuyển</span>
            <span>0 đ</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-2 text-sm">
            <span>Tổng tiền</span>
            <span className="font-medium text-red-700">
              {new Intl.NumberFormat("vi-VN")
                .format(cartData?.cart?.totalPrice || 0)
                .replace(".", ",")}
            </span>
          </div>
          <p className="text-sm text-gray-500">(Giá bán đã bao gồm VAT)</p>
        </div>

        <div className="flex flex-col lg:flex-row">
          <button
            onClick={() => setPaymentMethod("Thanh toán tiền mặt")}
            className={`text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  me-2 mb-2 ${
              paymentMethod === "Thanh toán tiền mặt"
                ? "border-red-700 border-2"
                : ""
            }`}
          >
            Thanh toán tiền mặt
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("ZaloPay")}
            className={`gap-2 text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  me-2 mb-2 ${
              paymentMethod === "ZaloPay" ? "border-red-800 border-2" : ""
            }`}
          >
            <img src={ZaloPay} alt="" className="object-cover h-6" />
            <span> ZaloPay</span>
          </button>
        </div>

        <button
          className="w-full py-2 mt-5 mb-4 text-white bg-red-700 rounded hover:bg-red-900"
          onClick={handleCreateOrder}
        >
          Tiến hành xác nhận
        </button>
      </div>
    </div>
  );
};

export default Checkout;
