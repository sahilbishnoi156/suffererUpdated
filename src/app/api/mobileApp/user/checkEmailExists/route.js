import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";

export const POST = async (request) => {
  try {
    await connectToDB();
    const { email } = await request.json();
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ emailExists: true }, { status: 409 });
    }
    return NextResponse.json({ emailExists: false }, { status: 200 });
  } catch (error) {
    console.error("Error creating a new user:", error);
    return new Response(
      "Failed to create a new user. Please try again later.",
      { status: 500 }
    );
  }
};
