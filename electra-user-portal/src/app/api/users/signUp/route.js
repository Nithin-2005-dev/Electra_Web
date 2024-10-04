import { connectDb } from "@/app/database/dbConfig";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { genSalt, hash } from "bcryptjs";
connectDb();
export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { userName, email, password, scholarId } = reqBody;
    if (userName == "" || email == "" || password == "" || scholarId == "") {
      return NextResponse.json({
        sucess: false,
        message: "mandatory fields are not filled",
      });
    }
    const userCheck = await User.findOne({ email });
    if (userCheck) {
      return NextResponse.json({
        sucess: false,
        message: "email already exists",
      });
    }
    const username = await User.findOne({ userName });
    if (username) {
      return NextResponse.json({
        sucess: false,
        message: "username already exists",
      });
    }
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      scholarId,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    return NextResponse.json({
      sucess: true,
      message: "user created sucessfully",
      statusCode: 201,
      savedUser,
    });
  } catch (err) {
    return NextResponse.json({
      sucess: false,
      message: err.message,
      statusCode: 500,
    });
  }
}
