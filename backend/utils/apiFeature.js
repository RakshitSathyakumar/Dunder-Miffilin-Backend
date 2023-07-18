class APIFeatures {
  constructor(query, queryAbout) {
    this.query = query;
    this.queryAbout = queryAbout;
  }
  search() {
    const name = this.queryAbout.name
      ? {
          name: { $regex: this.queryAbout.name, $options: "i" },
        }
      : {};

    // this.query = this.query.find({ ...name });
    // console.log(name);

      

    return this;
  }

  sortBy() {
    const queryCopy = { ...this.queryAbout };
    const removeFeild = ["name", "page", "limit"];
    // console.log("Before"+queryCopy);
    removeFeild.forEach((key) => {
      delete queryCopy[key];
    });
    console.log(queryCopy);

    
    // Price aur rating ke liye hai

    let queryStr = JSON.stringify(queryCopy);
    // console.log(queryStr);
    queryStr = queryStr.replace(/\b(lte|lt|gt|gte)\b/g,(key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryAbout.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }

}

module.exports = APIFeatures;
