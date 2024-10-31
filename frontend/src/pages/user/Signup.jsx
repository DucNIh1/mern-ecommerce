import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../../redux/api/authApiSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Signup = () => {
  const [signup] = useSignupMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    try {
      await signup(data).unwrap();
      navigate("/verify-email");
    } catch (error) {
      toast.error(error?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <>
      <form
        className="flex items-center text-[#1f2937] flex-col gap-6 leading-6 mt-14 w-[90%] mx-auto mb-20 max-w-[500px] p-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center gap-2 mt-10 mb-2 leading-6">
          <p className="text-[30px]">Đăng ký</p>
          <div className="w-[40px] h-[4px] bg-gray-800"></div>
        </div>

        <div className="flex flex-col w-full gap-2">
          <input
            type="text"
            placeholder="username"
            className="w-full px-3 py-2  border-gray-800 text-[#1f2937] border-[0.8px] bg-white rounded-md"
            {...register("username", {
              required: "Vui lòng nhập tên người dùng",
              minLength: {
                value: 3,
                message: "Tên người dùng phải có ít nhất 3 kí tự",
              },
            })}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="flex flex-col w-full gap-2">
          <input
            placeholder="Email"
            type="text"
            className="w-full px-3 py-2  border-gray-800 text-[#1f2937] border-[0.8px] bg-white rounded-md"
            {...register("email", {
              required: "Vui lòng nhập email",
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
        <Link
          to="/login"
          className="w-full text-sm font-medium text-red-500 transition-all duration-150 ease-linear text-end hover:text-red-900"
        >
          Đã có tài khoản? Đăng nhập
        </Link>
        <button className="px-8 py-3 mt-4 font-medium text-white duration-150 ease-linear bg-black rounded-lg hover:bg-red-500">
          Đăng kí
        </button>
      </form>
    </>
  );
};

export default Signup;
