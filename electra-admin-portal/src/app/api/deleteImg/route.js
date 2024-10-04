import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { ImageUpload } from "../../../models/Image.model";
import { ConnectDb } from "../../database/dbConfig";
export async function DELETE(req) {
  await ConnectDb();
  try {
    const id=req.nextUrl.searchParams.get('id');
    const data = await ImageUpload.findByIdAndDelete(id);
    
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({
      message: "something went wrong!",
      status: 500,
    });
  }
}
