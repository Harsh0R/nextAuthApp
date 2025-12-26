import connectDB from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "User LogOut",
      success: true,
    });

    await response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Erorr Occor while LongOut : ${errorMessage}`);
  }
}
