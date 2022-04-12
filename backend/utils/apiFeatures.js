class ApiFeatures {
    constructor(query, queryStr) {//query - keyword=random... queryStr - random
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i"//case insensitive ban gya
                },
            } : {};
        // console.log(keyword);
        this.query = this.query.find({...keyword});
        return this;
    }
}


module.exports = ApiFeatures; 