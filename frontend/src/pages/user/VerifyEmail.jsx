import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyEmailMutation } from "../../redux/api/authApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice";

const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  // Xử lý dán mã khi copy code vô ô nhập
  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      // cut mảng và gom thành chuỗi
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      // Nếu nhập 1 số
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  //Nếu người dùng nhấn phím "Backspace (Tab)" trong khi trường hiện tại trống, tiêu điểm sẽ chuyển về trường trước đó.
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      const res = await verifyEmail({ code: verificationCode }).unwrap();
      dispatch(setCredentials({ token: res.accessToken, user: res.user }));

      console.log(res);
      navigate("/");
      toast.success("Xác thực tài khoản thành công");
    } catch (error) {
      toast.error(error?.data?.message || "Lỗi khi xác thực tài khoản");
    }
  };

  return (
    <div className="bg-black backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto lg:my-40 py-16">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Xác minh email của bạn
      </h2>
      <p className="text-center text-gray-300 mb-6">
        Nhập 6 kí tự số đã được gửi qua email.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="6"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={isLoading || code.some((digit) => !digit)}
          className="w-full bg-gradient-to-r from-red-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-red-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isLoading ? "Đang xác minh..." : "Xác minh email"}
        </button>
      </form>
    </div>
  );
};
export default VerifyEmail;
