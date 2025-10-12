import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
}, { timestamps: true }); 

export default mongoose.model("Chat", chatSchema);
