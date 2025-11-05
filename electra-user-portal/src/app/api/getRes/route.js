// app/api/getRes/route.js
import { NextResponse } from "next/server";
import { ConnectDb } from "../../../app/database/dbConfig";
import { Resource } from "../../../models/resources.model";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req) {
  await ConnectDb();
  try {
    const body = await req.json();            // parse once
    const { semester, category } = body || {};
    if (!semester) {
      return NextResponse.json({ message: "semester required" }, { status: 400 });
    }

    const all = await Resource.find({ semester });
    const list = category && category !== "all" ? all.filter((e) => e.category === category) : all;

    return NextResponse.json(list, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("getRes route error:", err?.message || err);
    return NextResponse.json({ message: "something went wrong!" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST" }, { status: 405 });
}
