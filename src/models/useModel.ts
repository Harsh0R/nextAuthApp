import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true , "username is requre"],
        unique:true
    },
    email:{
        type:String,
        required:[true , "email is requre"],
        unique:true
    },
    password:{
        type:String,
        require:[true , "Please provide an password"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date
})

const User = mongoose.models.users || mongoose.model("users" , userSchema);

export default User;