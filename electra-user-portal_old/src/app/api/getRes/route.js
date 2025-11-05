import { ConnectDb } from "@/app/database/dbConfig";
import { Resource } from "@/models/resources.model";
import { NextResponse } from "next/server";
export async function POST(req) {
    await ConnectDb();
    try{
        const reqBody=await req.json();
        const {semester,category}=reqBody

      const data= await Resource.find({semester});
      const newData=data.filter((ele)=>{
        return category===ele.category
      })
      return NextResponse.json(newData)
    }catch(err){
        return NextResponse.json({
            message:'something went wrong!'+err,
            status:500,
        })
    }
}