const Data = require("../models/dataModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


exports.addEntry = catchAsyncErrors(async (req, res, next) => {
    let { newEntry, item } = req.body;
    if (item === "bidTimeList") {
        newEntry = parseInt(newEntry);
    }
    var query = {};
    query[item] = newEntry;
    const dataDocument = await Data.findByIdAndUpdate("62ea446ef91380cf34601403",
        {
            $push: query
        },
        {
            new: true,
            runValidators: true
        }

    );
    await dataDocument.save();

    res.status(201).json({
        status: "success",
        message: `${newEntry} added successfully in ${item}`,
    });


});


exports.removeEntry = catchAsyncErrors(async (req, res, next) => {

    let { newEntry, item } = req.body;
    if (item === "bidTimeList") {
        newEntry = parseInt(newEntry);
    }
    var query = {};
    query[item] = newEntry;
    const dataDocument = await Data.findByIdAndUpdate("62ea446ef91380cf34601403",
        {
            $pull: query
        },
        {
            new: true,
            runValidators: true
        }

    );
    await dataDocument.save();

    res.status(200).json({
        status: "success",
        message: `${newEntry} removed successfully from ${item}`,
    });


});


exports.updatePackage = catchAsyncErrors(async (req, res, next) => {
    let { pkgName, newPrice, newDesc, newProductsAllowed } = req.body;

    const dataDocument = await Data.findById("62ea446ef91380cf34601403")
    dataDocument.packages.map((package) => {
        if (package.name === pkgName) {
            package.price = parseInt(newPrice);
            package.description = newDesc;
            package.productsAllowed = newProductsAllowed;
            return;
        }
    });
    await dataDocument.save();
    res.status(200).json({
        success: true,
        message: `${pkgName} package updated successfully`,
    })
});


// -------------------------------------------------------------- //

exports.getData = catchAsyncErrors(async (req, res, next) => {
    const data = await Data.findById("62ea446ef91380cf34601403");
    res.status(200).json({
        status: "success",
        data: data,
    });
}
);






