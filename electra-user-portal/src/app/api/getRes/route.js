import { NextResponse } from "next/server";
import { Resource } from "../../../models/resources.model";
import { ConnectDb } from "../../database/dbConfig";

export async function POST(req) {
  await ConnectDb();

  try {
    const { semester, subject, category } = await req.json();
    // 🔐 Validation (DO NOT REMOVE)
    if (!semester && !subject) {
      return NextResponse.json(
        { message: "semester and subject are required" },
        { status: 400 }
      );
    }

    // 🔎 Base query
    const query = {
      semester: semester,
      subject: subject,
    };

    // 🎯 Optional category filter
    if (category && category !== "all") {
      query.category = category;
    }

    const data = await Resource.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("getRes error:", err);

    return NextResponse.json(
      { message: "Something went wrong", error: err.message },
      { status: 500 }
    );
  }
}
