import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        
    },
    email : {
        type: String,
        unique: true,
    },
    passwordHash : {
        type: String,
    },
    googleId : {
        type: String,
        
    },
    credits : {
        type: Number,
        default: 1500,
    },
    organization : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",    
    }],
    activeOrganization : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

export default mongoose.model("User", userSchema);