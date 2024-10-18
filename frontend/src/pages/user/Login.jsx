import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { useState } from "react";
import { useLoginMutation } from "../../redux/api/authApiSlice.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice.js";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: res?.accessToken, user: res?.user }));
      navigate("/");
      toast.success("Đăng nhập thành công");
    } catch (error) {
      toast.error(error?.data?.message || "Đăng nhập thất bại");
      console.log(error);
    }
  };
  return (
    <>
      <form
        className="flex items-center text-[#1f2937] flex-col gap-6 leading-6 mt-14 w-[90%] mx-auto mb-20 max-w-[500px] p-5"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-2 mt-10 mb-2 leading-6">
          <p className="text-[30px]">Đăng nhập</p>
          <div className="w-[40px] h-[4px] bg-gray-800"></div>
        </div>
        <Input
          placeholder="Email"
          type={"email"}
          value={email}
          autoComplete="email"
          setValue={setEmail}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          autoComplete="current-password"
          setValue={setPassword}
        />
        <Link
          to={"/sign-up"}
          className="w-full text-sm font-medium text-pink-500 transition-all duration-150 ease-linear text-end hover:text-pink-900"
        >
          Đăng kí tài khoản
        </Link>
        <button className="px-8 py-3 mt-4 font-medium text-white duration-150 ease-linear bg-black rounded-lg hover:bg-pink-500">
          Đăng nhập
        </button>
      </form>
    </>
  );
};

export default Login;
