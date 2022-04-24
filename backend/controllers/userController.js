const User = require("../models/userModel")
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");

//Register an User
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "This is a sample public_id",
            url: "This is a sample url"
        },
    });

    sendToken(user, 201, res);
});


//User login by credentials
exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    //Checking is user has given email and password both

    if (!email || !password) {
        return next(new ErrorHandler("Please enter Credentials", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Credentials"), 401);
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Credentials"), 401);
    }


    sendToken(user, 200, res);

});