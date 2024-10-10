import { ConnectDb } from "@/app/database/dbConfig";
import { NextResponse } from "next/server";
export async function GET(req) {
    await ConnectDb()
    try{
        const response=NextResponse.json({
            message:'Logout sucessfully',
            success:true,
        })
        response.cookies.set('token',"",{
            httpOnly:true,expires :new Date(0)
        })
        return response;
    }catch(err){
        return NextResponse.json({
            error:err.message,
            status:500
        })
    }
}