import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
const { connectDb } = require("@/app/dbConfig/dbConfig");
connectDb();
export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    console.log(req);
    const user = User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: `email doesn't exist`,
        status: 400,
      });
    }
    const validatePassword = await compare(password, user.password);
    if (!validatePassword) {
      return NextResponse.json({
        message: "password incorrect",
        status: 402,
      });
    }
    const tokendata = {
      id: user._id,
      userName: user.userName,
      email: user.email,
    };
    const token = await sign(tokendata, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    const response = NextResponse.json({
      message: "login sucessful",
      sucess: true,
    });
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (err) {
    return NextResponse.json({
      error: err.message,
      status: 500,
    });
  }
}
