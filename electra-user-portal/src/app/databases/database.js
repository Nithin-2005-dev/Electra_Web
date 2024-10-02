import mongoose from "mongoose";
export const connectDb=async()=>{
    try{
        const dbId=await mongoose.connect(`mongodb+srv://nk0402246:${process.env.DATABASE_PASSWORD}@practice.krwjt.mongodb.net`)
.then(console.log('database connected sucessfully'))
    }catch(err){
        console.log(err);
    }
}