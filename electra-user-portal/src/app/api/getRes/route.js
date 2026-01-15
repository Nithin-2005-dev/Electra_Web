import { NextResponse } from "next/server";
import { Resource } from "../../../models/resources.model";
import { ConnectDb } from "../../database/dbConfig";

export async function POST(req) {
  await ConnectDb();

  try {
    const { semester, subject, category } = await req.json();

    /* 🔐 VALIDATION */
    if (!semester || !subject) {
      return NextResponse.json(
        { message: "semester and subject are required" },
        { status: 400 }
      );
    }

    /* 🔎 BASE QUERY (BACKWARD COMPATIBLE) */
    const query = {
      semester,
      subject,
      $or: [
        { visibility: "public" },      // new public uploads
        { createdBy: "admin" },        // explicit admin uploads
        { ownerUid: null },            // legacy admin uploads
      ],
    };

    /* 🎯 OPTIONAL CATEGORY FILTER */
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
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
