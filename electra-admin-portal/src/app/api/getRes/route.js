import { NextResponse } from "next/server";
import { Resource} from "../../../models/resources.model";
import {ConnectDb} from '../../database/dbConfig'
export async function GET() {
    await ConnectDb();
    try{
      const data= await Resource.find();
      return NextResponse.json(data)
    }catch(err){
        return NextResponse.json({
            message:'something went wrong!'+err,
            status:500,
        })
    }
}