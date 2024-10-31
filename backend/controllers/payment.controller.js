import axios from "axios";
import catchAsync from "../utils/catchAsync.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import qs from "qs";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import dotenv from "dotenv";
dotenv.config();

const config = {
  app_id: process.env.ZALO_APP_ID,
  key1: process.env.ZALO_KEY_1,
  key2: process.env.ZALO_KEY_2,
  endpoint_create: process.env.ZALO_END_POINT_CREATE,
  endpoint_query: process.env.ZALO_ENDPOINT_QUERY,
  refund_url: process.env.ZALO_ENDPOINT_REFUND,
};

export const createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const {
    username = "name",
    street = "street",
    phone = "phone",
    city = "city",
    district = "district",
    ward = "ward",
    items = [],
    paymentMethod = "ZaloPay",
    totalPrice = 50000,
  } = req.body;

  const embed_data = {
    redirecturl: process.env.CLIENT_URL,
    user: userId,
    shippingAddress: {
      username,
      street,
      phone,
      city,
      district,
      ward,
    },
    items,
    paymentMethod,
    totalPrice,
  };

  const transID = Math.floor(Math.random() * 1000000);

  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: totalPrice,
    //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
    //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
    callback_url:
      "https://eb59-1-54-213-79.ngrok-free.app/api/payment/callback-order",
    description: `Zalo - Payment for the order #${transID}`,
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint_create, null, {
      params: order,
    });
    console.log("----send request to payment with zalopay---\n");
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
  }
});

// callback gọi lại để xác nhận đã thanh toán hay chưa
export const callbackOrder = catchAsync(async (req, res, next) => {
  console.log("-----send callback to check  payment status------\n");

  let result = {};
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
      console.log("-----Payment  failed, invalid mac------\n");
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      console.log("-----Payment success ------\n");

      let dataJson = JSON.parse(dataStr, config.key2);
      //  Create order khi thanh toán thành công

      const orderData = JSON.parse(dataJson.embed_data);

      await Order.create({
        user: orderData.user,
        shippingAddress: orderData.shippingAddress,
        items: orderData.items,
        paymentMethod: orderData.paymentMethod || "ZaloPay",
        totalPrice: orderData.totalPrice,
        appTransId: dataJson.app_trans_id,
        isPaid: true, // Cập nhật trạng thái thanh toán
        paidAt: new Date(),
      });

      // Xóa sản phẩm trong giỏ hàng
      const cart = await Cart.findOne({ user: orderData.user });
      if (cart) {
        cart.items = [];

        await cart.save(); // Lưu giỏ hàng đã cập nhật
      }

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    console.log("lỗi:::" + ex.message);
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

export const checkOrderStatus = catchAsync(async (req, res, next) => {
  const app_trans_id = req.params.app_trans_id;
  let postData = {
    app_id: config.app_id,
    app_trans_id: app_trans_id, // Input your app_trans_id
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: config.endpoint_query,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  const response = await axios(postConfig);

  res.status(200).json({ data: response.data });
});

// export const refund = catchAsync(async (req, res, next) => {
//   const zp_trans_id = req.params.zp_trans_id;
//   const timestamp = Date.now();
//   const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`; // unique id

//   let params = {
//     app_id: config.app_id,
//     m_refund_id: `${moment().format("YYMMDD")}_${config.app_id}_${uid}`,
//     timestamp, // miliseconds
//     zp_trans_id: zp_trans_id,
//     amount: "50000",
//     description: "ZaloPay Refund Demo",
//   };

//   // app_id|zp_trans_id|amount|description|timestamp
//   let data =
//     params.app_id +
//     "|" +
//     params.zp_trans_id +
//     "|" +
//     params.amount +
//     "|" +
//     params.description +
//     "|" +
//     params.timestamp;
//   params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//   const response = await axios.post(config.refund_url, null, { params });

//   console.log(response);
//   res.status(200).json({ data: response.data });
// });
