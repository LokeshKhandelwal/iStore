const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
// const ErrorHandler = require("../utils/errorHandler");
//because apna bhaut sari request hain to ek async ka error handler bnalenge try catch ki jgah (ex: Agar kisine name of product nhi diya toh)

//Read - get we use cotroller to minimize some extra line of same code in Routes
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const resultPerPage = 4;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products
    });
});

//Create-post{Export sath sath kar rhe hain}                                           ---------Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    const products = await Product.create(req.body);
    res.status(201).json({
        success: true,
        products
    });
});

//update - put                                                                        ---------Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 500))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false,
        runValidators: true
    })//id,what to change,object pass karna hain
    res.status(200).json({
        success: true,
        product
    })
});


//delete                                                                              -------Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 500))
    }
    await product.remove();//remove method
    res.status(200).json({
        success: true,//delete hone ke baad product nhi bhejna
        message: "Product is deleted"
    })
})


//get single Product get

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 500))
    }
    res.status(200).json({
        success: true,
        product,
        productCount,
    });
});
