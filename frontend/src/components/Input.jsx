/* eslint-disable react/prop-types */
const Input = ({ type, value, setValue, placeholder, ...props }) => {
  return (
    <>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        {...props}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-3 py-2  border-gray-800 text-[#1f2937] border-[0.8px] bg-white rounded-md"
      />
    </>
  );
};

export default Input;
