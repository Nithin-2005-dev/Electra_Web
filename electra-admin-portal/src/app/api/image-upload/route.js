import { ConnectDb } from "../../database/dbConfig";
import { ImageUpload} from "@/models/Image.model";
import {  NextResponse } from "next/server";
export async function POST(req) {
console.log('db connecting')
await ConnectDb();
console.log('db connected')
  try {
    const reqBody = await req.json();
    if(!reqBody){
      return NextResponse.json({
          message:'something went wrong!',
          status:500,
      })
  }
    const { publicId, date, year, category } = reqBody;
    if (publicId == "" || date == "" || year == "" || category == "") {
      return NextResponse.json({
        message: "enter mandatory fields",
      });
    }
    const result = await ImageUpload.create({
      publicId,
      date,
      year,
      category,
    });

    if (!result) {
      return NextResponse.json({
        message: "something went wrong !! please upload again",
        status: 500,
      });
    } else {
      return NextResponse.json({
        result,
        success: true,
      });
    }
  } catch (err) {
    return NextResponse.json({
      message: "something went wrong"+err,
      status: 500,
    });
  }
}
