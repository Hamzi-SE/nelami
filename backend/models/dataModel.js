const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    bidTimeList: {
        type: Array,
        default: [],
    },
    bikeMakeList: {
        type: Array,
        default: [],
    },
    carMakeList: {
        type: Array,
        default: [],
    },
    carFuelTypeList: {
        type: Array,
        default: [],
    },
    allCitiesList: {
        type: Array,
        default: [],
    },
    provinceList: {
        type: Array,
        default: [],
    },
    punjabCitiesList: {
        type: Array,
        default: [],
    },
    sindhCitiesList: {
        type: Array,
        default: [],
    },
    balochistanCitiesList: {
        type: Array,
        default: [],
    },
    kpkCitiesList: {
        type: Array,
        default: [],
    },
    azadKashmirCitiesList: {
        type: Array,
        default: [],
    },
    northernAreasList: {
        type: Array,
        default: [],
    },
    islamabadSectorsList: {
        type: Array,
        default: [],
    },
    packages: [
        {
            name: {
                type: String,
                default: ""
            },
            price: {
                type: Number,
                default: 0
            },
            productsAllowed: {
                type: Number,
                default: 0
            },
            description: {
                type: String,
                default: ""
            },
        },
    ],
})


module.exports = mongoose.model("Data", dataSchema);