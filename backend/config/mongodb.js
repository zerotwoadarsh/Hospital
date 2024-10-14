 import mongoose from "mongoose";


 const connectDb = async() => {
    await mongoose.connect(`${process.env.MONGODB_URL}/hospital`)
 }

export default connectDb