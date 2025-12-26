import connectDB from "@/db/dbConfig";
import sendEmail from "@/helpers/mailer";
import User from "@/models/useModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    //validation
    // console.log("reqBody in signup POST req => ", reqBody);

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "user already exist.." },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hased ==> ",hashedPassword);
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("newUser in signup route => ", savedUser);

    await sendEmail({email , emailType:"VERIFY" , userId:savedUser._id})

    return NextResponse.json({
        message:"User Register Successfully",
        success:true,
        savedUser
    })


  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
