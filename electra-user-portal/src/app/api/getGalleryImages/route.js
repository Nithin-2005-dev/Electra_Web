import { ConnectDb } from "../../database/dbConfig";
import { ImageUpload } from "../../../models/Image.model";
import { NextResponse } from "next/server";
export async function GET(req) {
  await ConnectDb();
  try {
    const event=req.nextUrl.searchParams.get('event');
    console.log(event)
    if(event!='all'){
    const response = await ImageUpload.find({category:event});
    return NextResponse.json(response)
    }else{
    const response = await ImageUpload.find();
    return NextResponse.json(response)
    }
  } catch (err) {
    return NextResponse.json({
      message: "something went wrong!",
      status: 500,
    });
  }
}
