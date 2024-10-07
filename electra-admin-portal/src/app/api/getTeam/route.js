import { NextResponse } from "next/dist/server/web/spec-extension/response";
import {ConnectDb} from '../../database/dbConfig'
import { Team } from "../../../models/team.model";
export async function GET() {
    await ConnectDb();
    try{
      const data= await Team.find();
      return NextResponse.json(data)
    }catch(err){
        return NextResponse.json({
            message:'something went wrong!'+err,
            status:500,
        })
    }
}