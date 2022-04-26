const User = require("../models/userModel")
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto")//built-in module

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


//LogOut
exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "Loged Out Successfully!"
    });
});

//forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    };
    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const ResetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password reset token is :- \n\n ${ResetPasswordUrl}\n\n if You Have not requested this email than, Please Ignore it!`;

    try {
        await sendEmail({
            email: user.email,
            subject: `iStore`,
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message), 500);

    }
})


//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    //creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has been Expired", 400));
    };

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password dosn't match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();//converting Password in hash and save

    sendToken(user,200,res);

});