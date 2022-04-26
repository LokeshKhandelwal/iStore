const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv")
const crypto = require("crypto")//built-in module

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
        maxlength: [30, "Name can't exceed 30 characters"],
        minlength: [4, "Name Should have 4 characters or more"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password"],
        minlength: [8, "Password Should have 8 characters or more"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },

    resetPasswordToken: String,

    resetPasswordExpire: Date,

});

//to hide password in mongodb
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)

});

// jwt token
userSchema.methods.getJWTToken = function () {

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
};

//Forgot password--Generating password reset token
userSchema.methods.getResetPasswordToken = function () {

    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and add  resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now()+ (15*60*1000);

    return resetToken;

};


module.exports = mongoose.model("User", userSchema);