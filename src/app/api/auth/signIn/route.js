import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET; // Replace with your actual JWT secret

export const POST = async (request) => {
  const { email, password } = await request.json();
  try {
    await connectToDB();
    const userExists = await User.findOne({email:email});
    if (!userExists) {
      return NextResponse.json({ userFound:false }, { status: 200 })
    }
    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch) {
      return NextResponse.json({ isMatch:false, userFound:true }, { status: 200 })
    }
    const tokenData = {
      _id: userExists._id,
      username: userExists.username,
      email: userExists.email
  } 
  
  const authToken = jwt.sign(tokenData, JWT_SECRET, {expiresIn: "2d"});
  const response = NextResponse.json({ authToken,userFound:true, isMatch:true, userId:userExists._id, user_name:userExists.username })
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 2);
  response.cookies.set("authToken", authToken, { httpOnly: true, expires: expirationDate });


  return response;
  } catch (error) {
    console.log(error)
    return new Response("Error Updating User", { status: 500 });
  }
};
