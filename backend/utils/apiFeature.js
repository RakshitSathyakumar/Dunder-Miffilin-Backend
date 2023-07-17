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

    this.query = this.query.find({ ...name });
    console.log(name);
    return this;
  }

  sortBy(){
    const queryCopy = {...this.queryAbout};
  }

}

module.exports = APIFeatures;
