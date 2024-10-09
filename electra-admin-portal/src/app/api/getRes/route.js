import { NextResponse } from "next/dist/server/web/spec-extension/response";
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