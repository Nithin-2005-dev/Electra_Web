import { Resource } from "../../../../models/resources.model";
import { ConnectDb } from "../../../database/dbConfig";
import { NextResponse } from "next/server";
import admin from "../../../lib/firebaseAdmin";
import mongoose from "mongoose";

export async function PUT(req) {
  await ConnectDb();

  try {
    // AUTH
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    // BODY
    const {
      id,
      name,
      driveUrl,
      semester,
      subject,
      category,
      visibility,
    } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid resource id" }, { status: 400 });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });
    }

    if (resource.ownerUid !== uid) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (driveUrl) updateData.driveUrl = driveUrl;
    if (semester) updateData.semester = semester;
    if (subject) updateData.subject = subject;
    if (category) updateData.category = category;
    if (visibility && ["private", "public"].includes(visibility)) {
      updateData.visibility = visibility;
    }

    await Resource.findByIdAndUpdate(id, updateData);

    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
