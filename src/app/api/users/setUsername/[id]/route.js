import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const PATCH = async (request, { params }) => {
  const { username, password } = await request.json();
  try {
    await connectToDB();
    // Find the existing prompt by ID
    const existingUser = await User.findById(params.id);

    if (!existingUser) {
      return new Response("Invalid Credentials", { status: 404 });
    }

    const salt = await bcrypt.genSalt(10);
    const secretPassword = await bcrypt.hash(password, salt);

    // Update the prompt with new data
    existingUser.username = username;
    existingUser.password = secretPassword;


    const tokenData = {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email
    } 
    
    await existingUser.save();
    const authToken = jwt.sign(tokenData, JWT_SECRET, {expiresIn: "1h"});
    const response = NextResponse.json({ authToken }, { status: 200 })
    response.cookies.set("authToken", authToken, {httpOnly: true});
    return response;
  } catch (error) {
    return new Response("Error Updating User", { status: 500 });
  }
};
