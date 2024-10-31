import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/api/authApiSlice";
import { useForm } from "react-hook-form";

const ResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { token } = useParams();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await resetPassword({ token, password: data.password });

      toast.success(
        "Khôi phục mật khẩu thành công, chuyển hướng đến trang đăng nhập..."
      );

      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <form
      className="flex items-center text-[#1f2937] flex-col gap-6 leading-6 mt-14 w-[90%] mx-auto mb-20 max-w-[500px] p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center gap-2 mt-10 mb-2 leading-6">
        <p className="text-[30px]">Đặt lại mật khẩu</p>
        <div className="w-[40px] h-[4px] bg-gray-800"></div>
      </div>
      <div className="flex flex-col w-full gap-2">
        <input
          placeholder="Mật khẩu"
          type="password"
          className="w-full px-3 py-2  border-gray-800 text-[#1f2937] border-[0.8px] bg-white rounded-md"
          {...register("password", {
            required: "Vui lòng nhập mật khẩu",
            minLength: {
              value: 8,
              message: "Mật khẩu phải có ít nhất 8 ký tự",
            },
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500 ">{errors.password.message}</p>
        )}
      </div>
      <div className="flex flex-col w-full gap-2">
        <input
          placeholder="Xác thực mật khẩu"
          type="password"
          className="w-full px-3 py-2  border-gray-800 text-[#1f2937] border-[0.8px] bg-white rounded-md"
          {...register("confirmPassword", {
            required: "Vui lòng nhập lại mật khẩu",
            validate: (value) => {
              if (value !== watch("password")) {
                return "Mật khẩu xác nhận không khớp";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        className="w-full px-4 py-3 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 "
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Đặt mật khẩu mới"}
      </button>
    </form>
  );
};

export default ResetPassword;
