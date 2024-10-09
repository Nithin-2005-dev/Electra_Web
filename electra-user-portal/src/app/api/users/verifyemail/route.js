import { ConnectDb } from "@/app/database/dbConfig";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    await ConnectDb();
    try{
        const reqBody=await req.json();
        const {token}=reqBody;
        console.log(token);
       const user= await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})
       if(!user){
        return NextResponse.json({
            error:'invalid token',
            status:400,
        })
       }
       user.isVerified=true;
       user.verifyToken=undefined;
       user.verifyTokenExpiry=undefined;
       user.save();
       return NextResponse.json({
            error:'email verified sucessfully',
            status:500,
            sucess:true
        })
    }catch(err){
        return NextResponse.json({
            error:err.message,
            status:500,
        })
    }
}