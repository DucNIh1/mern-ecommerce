import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useLoginMutation } from "../../redux/api/authApiSlice.js";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice.js";

import { useForm } from "react-hook-form";

const Login = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      if (!res.user) {
        return navigate("/verify-email");
      }
      dispatch(setCredentials({ token: res?.accessToken, user: res?.user }));
      navigate("/");
      toast.success("Đăng nhập thành công");
    } catch (error) {
      toast.error(error?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <>
      <form
        className="flex items-center text-[#1f2937] flex-col gap-6 leading-6 mt-14 w-[90%] mx-auto mb-20 max-w-[500px] p-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center gap-2 mt-10 mb-2 leading-6">
          <p className="text-[30px]">Đăng nhập</p>
          <div className="w-[40px] h-[4px] bg-gray-800"></div>
        </div>
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
        <div className="flex flex-col w-full gap-2">
          <input
            type="password"
            className="w-full px-3 py-2  border-gray-800 text-[#1f2937] border-[0.8px] bg-white rounded-md"
            {...register("password", {
              required: "Password là bắt buộc",
              minLength: {
                value: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự",
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex w-full">
          <Link
            to={"/sign-up"}
            className="block w-full text-sm font-medium text-black transition-all duration-150 ease-linear hover:text-blue-900"
          >
            Đăng kí tài khoản
          </Link>
          <Link
            to={"/forgot-password"}
            className="block w-full text-sm font-medium text-black transition-all duration-150 ease-linear text-end hover:text-blue-900"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <button className="px-8 py-3 mt-4 font-medium text-white duration-150 ease-linear bg-black rounded-lg hover:bg-amber-800">
          Đăng nhập
        </button>
      </form>
    </>
  );
};

export default Login;
