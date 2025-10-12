import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();    

const connectDB = async  ()=>{
    try{

        await mongoose.connect(process.env.MONGO_URI,{
            dbName:"llm-chat-platform",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");

    }catch(error){
        console.error("Error connecting to the database", error);
        process.exit(1);
    }
}

export default connectDB;