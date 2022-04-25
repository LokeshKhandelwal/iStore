const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true//left space and right space b/w name becomes Null
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxlength: [7, "Price limit reached"]
    },
    rating: {
        type: Number,
        default: 0
    },
    image: [//array use kremge for multiple images
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
        //we can also specify that the category should come under some predefine category using enum
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Stock of Product"],
        maxlength:[5,"Stock can't be exceed from 99999 units"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{//review likhenge toh required hona chaiye description
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product",productSchema);