class ApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Filter
    const queryObj = { ...this.queryString };
    const excludes = ["page", "sort", "limit", "fields"];

    excludes.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj); // đổi thành kiểu string để thay thế
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // thêm $ vào các gte... => $gte

    // Chuyển lại queryObj thành object sau khi thay thế toán tử
    const updatedQueryObj = JSON.parse(queryStr);
    // Nếu query có name, áp dụng regex để tìm kiếm theo ký tự
    if (updatedQueryObj.name) {
      // Tạo biểu thức chính quy với 'i' để tìm kiếm không phân biệt chữ hoa chữ thường
      updatedQueryObj.name = { $regex: new RegExp(updatedQueryObj.name, "i") };
    }

    if (updatedQueryObj.email) {
      // Tạo biểu thức chính quy với 'i' để tìm kiếm không phân biệt chữ hoa chữ thường
      updatedQueryObj.email = {
        $regex: new RegExp(updatedQueryObj.email, "i"),
      };
    }

    // Áp dụng $in cho các trường có giá trị là mảng dưới dạng chuỗi
    for (const field in updatedQueryObj) {
      if (typeof updatedQueryObj[field] === "string") {
        updatedQueryObj[field] = {
          $in: updatedQueryObj[field].split(",").map((value) => value.trim()),
        };
      }
    }

    this.query.find(updatedQueryObj);
    return this;
  }

  sort() {
    //-----------------SORT--------------------

    if (this.queryString.sort) {
      // query.sort chấp nhận -field là giảm , field là tăng
      const sortString = this.queryString.sort.replaceAll(",", " ");
      this.query = this.query.sort(sortString);
    } else {
      this.query = this.query.sort("-updatedAt -createdAt");
    }
    return this;
  }

  selectFields() {
    //------------SELECT FIELDS-----------------------
    if (this.queryString.fields) {
      const selectString = this.queryString.fields.replaceAll(",", " ");
      this.query = this.query.select(selectString);
    }
    return this;
  }
  paginate() {
    //------------Pagination--------------------
    const limit = +this.queryString.limit || 10;
    const page = +this.queryString.page || 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeature;
