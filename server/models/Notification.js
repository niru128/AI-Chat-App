import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

    toUser :  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    title : String,
    body : String,
    read : {
        type: Boolean,
        default: false,
    },
    createdAt : {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Notification", notificationSchema);