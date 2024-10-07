import { NextResponse } from "next/dist/server/web/spec-extension/response";
import {ImageUpload} from '../../../models/Image.model'
import {ConnectDb} from '../../database/dbConfig'
export async function GET() {
    await ConnectDb();
    try{
      const data= await ImageUpload.find();
      return NextResponse.json(data)
    }catch(err){
        return NextResponse.json({
            message:'something went wrong!'+err,
            status:500,
        })
    }
}