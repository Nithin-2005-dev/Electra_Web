import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { ConnectDb } from "@/app/database/dbConfig";
export async function POST(req) {
  await ConnectDb();
  try {
    const reqBody = await req.json();
    const { userName, email, scholarId, password, phone } = reqBody;
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ error: "user already exists", status: 400 });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
      scholarId,
      phone
    });
    const savedUser = await newUser.save();
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
    return NextResponse.json({
      message: "user reqistered sucessfully!",
      sucess: true,
      savedUser,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, status: 500 });
  }
}
