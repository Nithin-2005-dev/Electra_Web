import { Resource } from "../../../../models/resources.model";
import { ConnectDb } from "../../../database/dbConfig";
import { NextResponse } from "next/server";
import admin from "../../../lib/firebaseAdmin";
import { User } from "../../../../models/user.model";

const DRIVE_REGEX =
  /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/?/;

export async function POST(req) {
  await ConnectDb();

  try {
    /* ───────── AUTH CHECK ───────── */
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          title: "Authentication required",
          message:
            "Please sign in to upload resources.",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const uid = decoded.uid;
    const email = decoded.email || "";
    const firebaseName = decoded.name || "Unknown User";

    /* ───────── FETCH OPTIONAL PROFILE ───────── */
    const dbUser = await User.findOne({ uid });

    const role = dbUser?.role || "member";
    const ownerName =
      role === "admin"
        ? "Electra Society"
        : dbUser?.name || firebaseName;

    /* ───────── ACCESS CONTROL ───────── */
    const isAdmin = role === "admin";
    const isElectricalStudent = email.endsWith("@ee.nits.ac.in");

    if (!isAdmin && !isElectricalStudent) {
      return NextResponse.json(
        {
          title: "Access restricted",
          message:
            "Only Electrical Engineering students can upload resources.\n\nPlease sign in using your official @ee.nits.ac.in email ID.",
        },
        { status: 403 }
      );
    }

    /* ───────── REQUEST BODY ───────── */
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
        {
          title: "Missing information",
          message: "All fields are mandatory.",
        },
        { status: 400 }
      );
    }

    /* ───────── DRIVE LINK VALIDATION ───────── */
    if (!DRIVE_REGEX.test(driveUrl)) {
      return NextResponse.json(
        {
          title: "Invalid Drive link",
          message:
            "Please upload a valid Google Drive file link.\n\nExample:\nhttps://drive.google.com/file/d/FILE_ID/",
        },
        { status: 400 }
      );
    }

    /* ───────── VISIBILITY RULE ───────── */
    const finalVisibility =
      isAdmin && visibility === "public"
        ? "public"
        : "private";

    /* ───────── CREATE RESOURCE ───────── */
    const resource = await Resource.create({
      driveUrl,
      semester,
      subject,
      category,
      name,
      visibility: finalVisibility,

      ownerUid: uid,
      ownerName,
      createdBy: isAdmin ? "admin" : "user",
    });

    return NextResponse.json(
      {
        title: "Upload successful",
        message:
          "Your resource has been uploaded successfully.",
        id: resource._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("RESOURCE_UPLOAD_ERROR:", err);

    return NextResponse.json(
      {
        title: "Upload failed",
        message:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
