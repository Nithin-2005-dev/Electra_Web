import { Resource } from "../../../../models/resources.model";
import { ConnectDb } from "../../../database/dbConfig";
import { NextResponse } from "next/server";
import admin from "../../../lib/firebaseAdmin";
import mongoose from "mongoose";

export async function DELETE(req) {
  await ConnectDb();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const uid = decoded.uid;
    const role = decoded.role || "member";

    // ✅ READ ID FROM BODY (NOT params)
    const { id } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid resource id" }, { status: 400 });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });
    }

    const isOwner = resource.ownerUid === uid;
    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Resource.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
