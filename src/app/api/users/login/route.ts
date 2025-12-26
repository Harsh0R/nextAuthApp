import connectDB from "@/db/dbConfig";
import jwt from "jsonwebtoken";
import User from "@/models/useModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json(
        { message: "User dose not exist!!!" },
        { status: 400 }
      );
    }

    console.log("User exist...");

    const validpassword = await bcrypt.compare(password, user.password);
  
    console.log("valid pass => " , validpassword);
    
    if (!validpassword) {
      return NextResponse.json(
        { message: "Password is wrong❌❌❌" },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    if (!process.env.TOKEN_SECRETE) {
      console.log("TOKEN_SECRETE not found");
      return;
    }

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRETE, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({
      message: "User LogIn Successfull😊😊😊",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
