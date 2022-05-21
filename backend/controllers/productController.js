const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const { is } = require("express/lib/request");
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

    req.body.user = req.user.id;

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
        // productCount,
    });
});

//Update or create review
exports.createProductreview = catchAsyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                (rev.rating = rating), (rev.comment = comment)
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
    });
});


//Get all reviews of a Product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });

});


//Delete review
exports.deleteReview = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    })

    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    });

});