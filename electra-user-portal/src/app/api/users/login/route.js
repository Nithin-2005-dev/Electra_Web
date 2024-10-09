import { ConnectDb } from "@/app/database/dbConfig";
import { User } from "@/models/user.model";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server";
export async function POST(req) {
   await ConnectDb()
   try{
    const reqBody = await req.json();
    const { email,password} = reqBody;
    const user = await User.findOne({ email });
    if(!user){
        return NextResponse.json({ error: 'user does not exists', status: 400 });
    }
    const validPassword=await bcryptjs.compare(password,user.password);
    if(!validPassword){
        return NextResponse.json({ error: 'incorrect password', status: 400 });
    }
    const tokenData={
        id:user._id,
        email:user.email,
    }
    const token=await jwt.sign(tokenData,'nithin',{expiresIn:'1h'});
   const response= NextResponse.json({
        message:'logged in sucess',
        success:true
    })
    response.cookies.set('token',token,{
        httpOnly:true
    })
    return response;
   }catch(err){
    return NextResponse.json({ error: err.message, status: 500 });
   }
}