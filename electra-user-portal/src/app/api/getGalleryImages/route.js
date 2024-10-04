import { ConnectDb } from "@/app/database/dbConfig";
import { ImageUpload } from "@/models/Image.model";
import { NextResponse } from "next/server";
export async function GET() {
  await ConnectDb();
  try {
    const response = await ImageUpload.find();
    return NextResponse.json(response)
    return 
  } catch (err) {
    return NextResponse.json({
      message: "something went wrong!",
      status: 500,
    });
  }
}
