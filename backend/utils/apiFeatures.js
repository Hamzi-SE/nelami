class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr || {};
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                title: {
                    $regex: new RegExp(this.queryStr.keyword, 'i'),
                },
            }
            : {};

        const province = this.queryStr.province
            ? {
                "location.province": {
                    $regex: new RegExp(this.queryStr.province, 'i'),
                },
            }
            : {};

        const city = this.queryStr.city
            ? {
                "location.city": {
                    $regex: new RegExp(this.queryStr.city, 'i'),
                },
            }
            : {};

        this.query = this.query.find({ ...keyword, ...province, ...city, status: "Approved" });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // Removing Some Fields For Category
        const removeFields = ["keyword", "page", "limit", "province", "city"];
        removeFields.forEach(key => delete queryCopy[key]);

        // Filter For Price
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, key => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultsPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultsPerPage * (currentPage - 1);

        this.query = this.query.limit(resultsPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;
