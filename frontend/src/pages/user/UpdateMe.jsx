import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateMeMutation } from "../../redux/api/authApiSlice";
import { useForm } from "react-hook-form";

const UpdateMe = () => {
  const { user } = useSelector((state) => state.auth);

  const [updateMe] = useUpdateMeMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username,
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await updateMe({
        username: data.username,
        password: data.password,
      }).unwrap();
      toast.success(res?.message);
    } catch (error) {
      toast.error(error?.data?.message || "Lỗi khi cập nhật thông tin cá nhân");
    }
  };

  return (
    <div>
      <form
        className="flex items-center text-[#1f2937] flex-col gap-6 leading-6 mt-14 w-[90%] mx-auto mb-20 max-w-[500px] p-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center gap-2 mt-10 mb-2 leading-6">
          <p className="text-[30px]">Thay đổi thông tin cá nhân</p>
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
            placeholder="Mật khẩu"
            type="password"
            className="w-full px-3 py-2  border-gray-800 text-[#1f2937] border-[0.8px] bg-white rounded-md"
            {...register("password", {
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
        <button className="px-8 py-3 mt-4 font-medium text-white duration-150 ease-linear bg-black rounded-lg hover:bg-amber-800">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default UpdateMe;
