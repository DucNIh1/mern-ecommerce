class ApiFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Filter
    const queryObj = { ...this.queryString };
    console.log(queryObj);
    const excludes = ["page", "sort", "limit", "fields"];

    excludes.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj); // đổi thành kiểu string để thay thế
    console.log(queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // thêm $ vào các gte... => $gte

    this.query.find(JSON.parse(queryStr));
    console.log(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //-----------------SORT--------------------

    if (this.queryString.sort) {
      console.log(this.queryString);
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
