import mongoose ,{ Schema } from "mongoose";


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        password: {
            type: String,
            required: true
        },
        verifyOtp: {
            type:String,
            dafault: ""
        },
        verifyOtpExpireAt: {
            type: Number,
            default: 0
        },
        isAccountVerified: {
            type: Boolean,
            default: false
        },
        resetOtp: {
            type:String,
            default: ""
        },
        resetOtpExpireAt: {
            type: Number,
            default: 0
        }
    });

const User = mongoose.models.user || mongoose.model("User", userSchema);

export default User;