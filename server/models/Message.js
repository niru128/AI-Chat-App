import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    chat : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",             // ✅ Add this
  },
    role : {
        type: String,
        enum: ["user", "assistant", "system"],
        default: "user",
    },
    content : {
        type: String,
        required: true,
    },
    tokens : {
        type : Number,
        default: 0,
    },
    createdAt : {
        type: Date,
        default: Date.now,
    },
    metaData : {
        type: Object,
    }
})

export default mongoose.model("Message", messageSchema);