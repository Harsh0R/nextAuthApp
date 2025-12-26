import connectDB from "@/db/dbConfig";
import User from "@/models/useModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDB();

export async function GET(request: NextRequest) {
  const userId = await getDataFromToken(request);

  const user = await User.findOne({ _id: userId }).select("-password");

  if (!user) {
    console.log("Token is Invalid");
    return;
  }

  return NextResponse.json({ message: "User Found", data: user });
}
