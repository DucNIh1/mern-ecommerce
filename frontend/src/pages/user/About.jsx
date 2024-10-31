const About = () => {
  return (
    <div className="mt-10">
      <h2 className="mb-4 text-2xl font-bold text-center text-gray-700">
        Liên hệ
        <span className="inline-block w-10 h-1 ml-5 align-middle border-b-2 border-gray-500"></span>
      </h2>
      <div className="flex max-w-5xl p-8 mx-auto mt-20 mb-40 bg-white border-2">
        <div className="w-1/2">
          <img
            alt="A cup of coffee on a coaster, a succulent plant, a smartphone, and a laptop on a white table"
            className="w-full h-auto"
            height="400"
            src="https://storage.googleapis.com/a1aa/image/tpVgsyiQvK79NBtmYw2Fdb9G0n2037ONU53fshAB4fwTY7rTA.jpg"
            width="400"
          />
        </div>
        <div className="flex flex-col w-1/2 gap-10 pl-8 mb-8">
          <h3 className="text-lg font-bold text-gray-700">Cửa hàng</h3>
          <p className="text-gray-600">Địa chỉ: Liên Hà, Đông Anh Hà Nội</p>
          <p className="text-gray-600">
            Phone: 0369936010
            <br />
            Email: ducninh10x03@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
