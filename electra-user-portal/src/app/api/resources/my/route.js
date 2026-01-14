import { Resource } from "../../../../models/resources.model.js";
import { ConnectDb } from "../../../database/dbConfig.js";
import { NextResponse } from "next/server";
import admin from "../../../lib/firebaseAdmin";

export async function GET(req) {
  await ConnectDb();

  try {
    // 1️⃣ AUTH CHECK
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const uid = decoded.uid;

    // 2️⃣ FETCH USER RESOURCES
    const resources = await Resource.find({
      ownerUid: uid,
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        count: resources.length,
        resources,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
