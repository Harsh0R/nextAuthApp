import connectDB from "@/db/dbConfig";
import User from "@/models/useModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    console.log("token in verify route => ", token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {      
      console.log("User not found..");
      
      return NextResponse.json({ error: "Invalid Token!!!" }, { status: 400 });
    }

    console.log("User in varify route after user veryfy => ", user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Email verify successfully...", success: true },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}
