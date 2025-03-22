 import mongoose from "mongoose";


 const connectDB = async() => {
    await mongoose.connect(`${process.env.MONGODB_URI}/hospital`)
 }

export default connectDB