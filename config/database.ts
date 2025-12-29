import mongoose from 'mongoose';

// const pathMongo = process.env.MONGO_URL;
//import mongoose
//mongodb://localhost:27017/product-management
export const connect =  async() : Promise<void>=> {
    try{
        await mongoose.connect(process.env.MONGO_URL! || 'mongodb+srv://legiabaoprovanai:Abcd1234567890@cluster0.y66f1qv.mongodb.net/music-app');
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}