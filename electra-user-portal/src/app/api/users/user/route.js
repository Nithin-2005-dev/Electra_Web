import { getDataFromToken } from "@/helpers/getDataFromToken";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
   const userId= await getDataFromToken(req);
  const user=await User.findOne({_id:userId}).select("-password");
  if(!user){
    message:"invalid token"
  } 
  return NextResponse.json({
    message:"user found",
    data:user
  })
}