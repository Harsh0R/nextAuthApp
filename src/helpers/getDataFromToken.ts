import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = (request: NextRequest) => {
  try {

    const token = request.cookies.get("token")?.value || "";

    if (!process.env.TOKEN_SECRETE) {
        console.log("TOKEN_SECRETE not found while getDataFromToken");
        return;
    }
    
    const decodedToken:any = jwt.verify(token , process.env.TOKEN_SECRETE);

    return decodedToken.id;

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Erorr Occor while Get data from Token : ${errorMessage}`);
  }
};
