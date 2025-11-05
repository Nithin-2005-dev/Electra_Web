import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
        userName:{
            type:String,
            required:[true,'please provide userName'],
            unique:true,
        },
        phone:{
            type:String,
            required:[true,'please provide phone number'],
        },
        email:{
            type:String,
            required:[true,'please provide email']
        },
        scholarId:{
            type:Number,
            required:[true,'please provide scholar id']
        },
        password:{
            type:String,
            required:[true,'please provide password'],
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        isAdmin:{
            type:Boolean,
            default:false,
        },
        ForgotPasswordToken:String,
        FrogotPasswordTokenExpiry:Date,
        verifyToken:String,
        verifyTokenExpiry:Date,
});
export const User=mongoose.models.User || mongoose.model('User',userSchema);