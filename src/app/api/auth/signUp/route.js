import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const POST = async (request) => {
  try {
    await connectToDB();

    const {
      email,
      username,
      password,
      first_name: given_name,
      last_name: family_name,
      image,
      location,
    } = await request.json();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        {
          userCreated: false,
          message: "User Already Exists",
          user: userExists,
        },
        { status: 200 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      given_name,
      family_name,
      username,
      email,
      password: hashedPassword,
      image,
      location: {
        coordinates: [location.latitude || 0, location.longitude || 0],
      },
    });

    await User.createIndexes();

    await newUser.save();

    const tokenData = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    const authToken = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "2d" });

    const response = NextResponse.json(
      {
        newUser,
        authToken,
        userCreated: true,
      },
      { status: 201 }
    );

    response.cookies.set("authToken", authToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Set expiration directly
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Error creating a new user:", error);
    return new Response(
      "Failed to create a new user. Please try again later.",
      { status: 500 }
    );
  }
};
