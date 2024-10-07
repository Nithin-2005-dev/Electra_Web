import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { ConnectDb } from "../../database/dbConfig";
import { Team } from "../../../models/team.model";
export async function DELETE(req) {
  await ConnectDb();
  try {
    const id=req.nextUrl.searchParams.get('id');
    const data = await Team.findByIdAndDelete(id);
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({
      message: "something went wrong!",
      status: 500,
    });
  }
}
