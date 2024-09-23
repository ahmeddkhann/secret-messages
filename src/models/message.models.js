import mongoose, {Schema} from "mongoose";

const MessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
},{timestamps: true})

const messageModel = (mongoose.models.Message) || (mongoose.model("Message", MessageSchema))
export default messageModel