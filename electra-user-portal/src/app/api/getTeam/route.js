import { NextResponse } from "next/dist/server/web/spec-extension/response";
import {ConnectDb} from '../../database/dbConfig'
import { Team } from "@/models/team.model.js";
export async function GET(req) {
    await ConnectDb();
    try{
        const year=req.nextUrl.searchParams.get('team');
      const data= await Team.find({year});
      return NextResponse.json(data)
    }catch(err){
        return NextResponse.json({
            message:'something went wrong!'+err,
            status:500,
        })
    }
}