import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if(!uri) throw new Error ("MONGO_YRI is not set");

     try{
        await mongoose.connect(uri, {dbname: "chatty"})
        console.log("MongoDB connected");
     } catch (error){
        console.error("MongoDB connection error",error);
        process.exit(1);
     }
}