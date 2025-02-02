const { model, Schema, Types } = require('mongoose');
const userSchema  = new Schema({
    Email:String,
    Password: String,
    Avatar:{
        type: String,
        default: './upload/default.jpg'
    },
    Name:String,
    address:String,
    mobile:Number,
    Active:Boolean,
    RegisterDate:Date,
    userType:Number, // 0 user , 1 admin
    resetPasswordToken: {
        type: String,
        default: ''
     },
     resetPasswordExpires: {
         type: Date,
    },
    articleID: {
        type: Schema.Types.ObjectId,
        default: null
    }
})
module.exports = model("users",userSchema);