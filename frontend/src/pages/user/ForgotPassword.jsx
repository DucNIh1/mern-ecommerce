import { useState } from "react";
import { BsArrowLeft, BsMailbox } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/api/authApiSlice";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  //API
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await forgotPassword(data.email);
      console.log(res);
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-40 overflow-hidden bg-white border shadow-xl rounded-2xl">
      <div className="p-8">
        <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text">
          Quên mật khẩu
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="mb-6 text-center text-gray-600">
              Nhập địa chỉ email của bạn để nhận được đường dẫn khôi phục mật
              khẩu.
            </p>

            <div className="flex flex-col w-full gap-2">
              <input
                type="text"
                className="w-full px-3 py-2  border-gray-800 text-[#1f2937] border-[0.8px] bg-white rounded-md"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Địa chỉ email không hợp lệ",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <button
              className="w-full px-4 py-3 my-5 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              type="submit"
            >
              {isLoading ? (
                <div className="mx-auto border border-white size-6 animate-spin border-t-transparent" />
              ) : (
                "Gửi email khôi phục"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500">
              <BsMailbox className="w-8 h-8 text-white" />
            </div>
            <p className="mb-6 text-gray-300">
              If an account exists for {watch("email")}, you will receive a
              password reset link shortly.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center px-8 py-4 bg-gray-200 bg-opacity-50">
        <Link
          to={"/login"}
          className="flex items-center text-xl font-medium text-transparent bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text hover:from-amber-700 hover:to-amber-950"
        >
          <BsArrowLeft className="mr-2 font-medium text-amber-600 size-7" /> Trở
          lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
