import { Resource } from "../../../../models/resources.model";
import { ConnectDb } from "../../../database/dbConfig";
import { NextResponse } from "next/server";
import admin from "../../../lib/firebaseAdmin";

export async function POST(req) {
  await ConnectDb();

  try {
    /* 1️⃣ AUTH CHECK */
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    console.log(decoded)
    const uid = decoded.uid;
    const role = decoded.role || "member";

    /* 2️⃣ GET OWNER NAME (SAFE) */
    let ownerName = decoded.name || null;

    /* 3️⃣ BODY */
    const {
      driveUrl,
      semester,
      subject,
      category,
      name,
      visibility = "private",
    } = await req.json();

    if (!driveUrl || !semester || !subject || !category || !name) {
      return NextResponse.json(
        { message: "All fields are mandatory" },
        { status: 400 }
      );
    }

    /* 4️⃣ VISIBILITY ENFORCEMENT */
    let finalVisibility = "private";

    if (role === "admin" && visibility === "public") {
      finalVisibility = "public";
    }

    /* 5️⃣ CREATE RESOURCE */
    const resource = await Resource.create({
      driveUrl,
      semester,
      subject,
      category,
      name,

      visibility: finalVisibility,

      ownerUid: uid,
      ownerName: role === "admin" ? null : ownerName, // admin → Electra
      createdBy: role === "admin" ? "admin" : "user",
    });

    return NextResponse.json(
      {
        message: "Resource uploaded successfully",
        id: resource._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
