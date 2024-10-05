import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { Resource} from "../../../models/resources.model";
import { ConnectDb } from "../../database/dbConfig";
export async function DELETE(req) {
  await ConnectDb();
  try {
    const id=req.nextUrl.searchParams.get('id');
    const data = await Resource.findByIdAndDelete(id);
    
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({
      message: "something went wrong!",
      status: 500,
    });
  }
}