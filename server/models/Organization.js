import mongoose from "mongoose";    

const organizationSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true,
    },
    members : [{
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
    
        },
        role : {
            type: String,
            enum: ["admin", "member"],
            default: "member",
        }
    }],
    createdAt : {
        type: Date,
        default: Date.now,
    }   
})

export default mongoose.model("Organization", organizationSchema);