import mongoose, {Schema} from "mongoose";
import { boolean } from "zod";

const userSchema = new Schema ({
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "please use a valid email address"
    ]
    },
    username:{
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    verifyCode: {
        type: String,
        required: [true, "verify code is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    verifyCodeExpiry: {
        type: Date
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: boolean,
        default: false
    },
    messages: []
   
},{ timestamps: true})

const userModel = (mongoose.models.User) || (mongoose.model("User", userSchema))
export default userModel